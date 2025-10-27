/*
 * Golden Sun Sprite Registry
 * 
 * Complete mapping of game units to authentic Golden Sun sprites
 * Supports multiple weapons, animation states, and fallback system
 */

import type { Role } from '../types/game.js';

// ============================================
// ASSET MODE: GS (Golden Sun) or Simple (Built-in)
// ============================================
const ASSET_MODE: 'gs' | 'simple' = (() => {
  // Check if Golden Sun assets exist by looking for a known file
  // In dev, we prefer GS if available; in prod, env var controls
  if (typeof window === 'undefined') return 'simple'; // SSR safety

  const isDev = import.meta.env?.DEV ?? false;
  const forceGS = import.meta.env?.VITE_USE_GS_ASSETS === 'true';

  // In dev, default to GS if we have the assets
  // In prod, require explicit opt-in
  return (isDev || forceGS) ? 'gs' : 'simple';
})();

console.log(`[SpriteRegistry] Asset mode: ${ASSET_MODE}`);

// ============================================
// UI Sprites (Icons, Elements, Equipment)
// ============================================

export const UI_SPRITES = {
  // Gem icons (used in GemSelectScreen and BattleScreen)
  gems: {
    mars: '/sprites/ui/gems/mars.gif',
    mercury: '/sprites/ui/gems/mercury.gif',
    jupiter: '/sprites/ui/gems/jupiter.gif',
    venus: '/sprites/ui/gems/venus.gif',
    moon: '/sprites/ui/gems/moon.gif',
    sun: '/sprites/ui/gems/sun.gif',
  },
  
  // Element indicators (used in UnitCard, OpponentCard)
  elements: {
    Mars: '/sprites/ui/elements/fire.gif',
    Mercury: '/sprites/ui/elements/water.gif',
    Jupiter: '/sprites/ui/elements/lightning.gif',
    Venus: '/sprites/ui/elements/earth.gif',
    Moon: '/sprites/ui/elements/light.gif',
    Sun: '/sprites/ui/elements/dark.gif',
  },
  
  // Equipment icons (used in EquipmentScreen, RewardsScreen)
  equipment: {
    weapon: '/sprites/ui/equipment/sword.gif',
    armor: '/sprites/ui/equipment/shield.gif',
    accessory: '/sprites/ui/equipment/ring.gif',
    gem: '/sprites/ui/equipment/gem.gif',
    // Stat indicators
    attack: '/sprites/ui/equipment/sword.gif',
    defense: '/sprites/ui/equipment/shield.gif',
    speed: '/sprites/ui/elements/lightning.gif',
  },
} as const;

// ============================================
// Sprite Animation States
// ============================================

export type SpriteAnimState = 
  | 'idle'      // Standing/waiting
  | 'attack1'   // First attack frame
  | 'attack2'   // Second attack frame
  | 'hit'       // Taking damage
  | 'downed'    // Defeated/KO
  | 'cast1'     // Spell casting frame 1
  | 'cast2';    // Spell casting frame 2

export type WeaponType = 
  | 'lSword'    // Long sword
  | 'Axe'       // Axe
  | 'lBlade'    // Long blade
  | 'Mace';     // Mace

// ============================================
// Sprite Set Definition
// ============================================

export interface SpriteSet {
  readonly idle: string;
  readonly attack1: string;
  readonly attack2: string;
  readonly hit: string;
  readonly downed: string;
  readonly cast1?: string;
  readonly cast2?: string;
}

// Alias for party sprites (same as SpriteSet)
export type PartySpriteSet = SpriteSet;

export interface CharacterSpriteMapping {
  readonly gsCharacter: string; // Golden Sun character name
  readonly defaultWeapon: WeaponType;
  readonly availableWeapons: readonly WeaponType[];
}

// ============================================
// Character Mappings (12 Starter Units → GS Characters)
// ============================================

export const UNIT_TO_GS_CHARACTER: Record<string, CharacterSpriteMapping> = {
  // === TANKS ===
  'Warrior': { 
    gsCharacter: 'isaac', 
    defaultWeapon: 'lSword', 
    availableWeapons: ['lSword', 'Axe', 'lBlade'] 
  },
  'Guardian': { 
    gsCharacter: 'garet', 
    defaultWeapon: 'Axe', 
    availableWeapons: ['Axe', 'Mace'] 
  },
  'Paladin': { 
    gsCharacter: 'felix', 
    defaultWeapon: 'lSword', 
    availableWeapons: ['lSword', 'lBlade'] 
  },

  // === DPS ===
  'Rogue': { 
    gsCharacter: 'ivan', 
    defaultWeapon: 'lBlade', 
    availableWeapons: ['lBlade'] 
  },
  'Mage': { 
    gsCharacter: 'ivan', 
    defaultWeapon: 'lBlade', 
    availableWeapons: ['lBlade'] 
  },
  'Ranger': { 
    gsCharacter: 'piers', 
    defaultWeapon: 'lSword', 
    availableWeapons: ['lSword', 'Mace'] 
  },

  // === SUPPORT ===
  'Cleric': { 
    gsCharacter: 'mia', 
    defaultWeapon: 'Mace', 
    availableWeapons: ['Mace'] 
  },
  'Shaman': { 
    gsCharacter: 'jenna_gs2', 
    defaultWeapon: 'lBlade', 
    availableWeapons: ['lBlade'] 
  },
  'Bard': { 
    gsCharacter: 'sheba', 
    defaultWeapon: 'Mace', 
    availableWeapons: ['Mace'] 
  },

  // === SPECIALISTS ===
  'Necromancer': { 
    gsCharacter: 'felix', 
    defaultWeapon: 'lBlade', 
    availableWeapons: ['lBlade', 'lSword'] 
  },
  'Engineer': { 
    gsCharacter: 'piers', 
    defaultWeapon: 'Mace', 
    availableWeapons: ['Mace', 'lSword'] 
  },
  'Summoner': { 
    gsCharacter: 'sheba', 
    defaultWeapon: 'Mace', 
    availableWeapons: ['Mace'] 
  },
};

// ============================================
// Enemy Sprite Mappings (19 Enemies → GS Sprites)
// ============================================

export const ENEMY_SPRITE_MAP: Record<string, string> = {
  // UNDEAD FACTION (4 enemies)
  'Skeleton Warrior': 'Undead',
  'Zombie Brute': 'Ghoul',
  'Necromancer': 'Ghost_Mage',
  'Ghost Assassin': 'Vile_Dirge',

  // MECH FACTION (4 enemies) - Using construct/golem sprites
  'Battle Mech Alpha': 'Golem',
  'Drone Swarm': 'Flash_Ant',
  'Repair Bot': 'Mimic',
  'Siege Cannon': 'Cerebus',

  // BEAST FACTION (3 enemies)
  'Dire Wolf': 'Wild_Wolf',
  'Bear Guardian': 'Wolfkin',
  'Serpent Striker': 'Creeper',

  // HOLY FACTION (3 enemies) - Using divine/knight sprites
  'Paladin Knight': 'Minotaurus',
  'Cleric Healer': 'Faery',
  'Holy Avenger': 'Gargoyle',

  // ARCANE FACTION (3 enemies) - Using magical creatures
  'Arcane Evoker': 'Gnome_Wizard',
  'Void Walker': 'Ghost_Mage',
  'Crystal Guardian': 'Grand_Chimera',

  // NATURE FACTION (3 enemies)
  'Treant Ancient': 'Mad_Plant',
  'Thorn Archer': 'Hobgoblin',
  'Druid Shaman': 'Amaze',
};

// Role-based fallbacks for unmapped enemies
const ROLE_FALLBACK_SPRITES: Record<Role, string> = {
  Tank: 'Brigand',
  DPS: 'Goblin',
  Support: 'Gnome_Wizard',
  Specialist: 'Mimic',
};

// ============================================
// Battle Backgrounds (20 selected from 72 total)
// ============================================

export const BATTLE_BACKGROUNDS = [
  // === Core Environments (GS1) ===
  '/sprites/golden-sun/backgrounds/gs1/Cave.gif',
  '/sprites/golden-sun/backgrounds/gs1/Desert.gif',
  '/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif',

  // === Forests & Nature (GS1) ===
  '/sprites/golden-sun/backgrounds/gs1/Kolima_Forest.gif',
  '/sprites/golden-sun/backgrounds/gs1/Mogall_Forest.gif',
  '/sprites/golden-sun/backgrounds/gs1/Altin_Peak.gif', // Mountain peak

  // === Dark & Undead (GS1) ===
  '/sprites/golden-sun/backgrounds/gs1/Crossbone_Isle_Cave.gif',
  '/sprites/golden-sun/backgrounds/gs1/Dark_Sky.gif',
  '/sprites/golden-sun/backgrounds/gs1/Tunnel_Ruins.gif',

  // === Lighthouses & Holy (GS1) ===
  '/sprites/golden-sun/backgrounds/gs1/Mercury_Lighthouse.gif',
  '/sprites/golden-sun/backgrounds/gs1/Venus_Lighthouse.gif',
  '/sprites/golden-sun/backgrounds/gs1/Babi_Lighthouse.gif',

  // === Deserts & Barren (GS1) ===
  '/sprites/golden-sun/backgrounds/gs1/Lamakan_Desert.gif',
  '/sprites/golden-sun/backgrounds/gs1/Altmillar_Cave.gif',

  // === Elemental Locations (GS2) ===
  '/sprites/golden-sun/backgrounds/gs2/Magma_Rock.gif', // Fire element
  '/sprites/golden-sun/backgrounds/gs2/Aqua_Rock_Inside.gif', // Water element
  '/sprites/golden-sun/backgrounds/gs2/Gaia_Rock_Inside.gif', // Earth element
  '/sprites/golden-sun/backgrounds/gs2/Jupiter_Lighthouse.gif', // Wind element

  // === Special Locations (GS2) ===
  '/sprites/golden-sun/backgrounds/gs2/Mars_Lighthouse.gif',
  '/sprites/golden-sun/backgrounds/gs2/Anemos_Inner_Sanctum.gif', // Mystical sanctum
];

// Tag-based background mapping for thematic battles
// Each enemy tag now has 3-4 background options for variety
const BG_BY_TAG: Record<string, string[]> = {
  Undead: [
    '/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif', // Dark temple
    '/sprites/golden-sun/backgrounds/gs1/Crossbone_Isle_Cave.gif', // Haunted cave
    '/sprites/golden-sun/backgrounds/gs1/Dark_Sky.gif', // Ominous sky
    '/sprites/golden-sun/backgrounds/gs1/Tunnel_Ruins.gif', // Ancient ruins
  ],

  Mech: [
    '/sprites/golden-sun/backgrounds/gs1/Babi_Lighthouse.gif', // Tech structure
    '/sprites/golden-sun/backgrounds/gs1/Tunnel_Ruins.gif', // Industrial ruins
    '/sprites/golden-sun/backgrounds/gs1/Desert.gif', // Barren mechanical
    '/sprites/golden-sun/backgrounds/gs2/Mars_Lighthouse.gif', // Advanced tech
  ],

  Beast: [
    '/sprites/golden-sun/backgrounds/gs1/Kolima_Forest.gif', // Dense forest
    '/sprites/golden-sun/backgrounds/gs1/Mogall_Forest.gif', // Wild forest
    '/sprites/golden-sun/backgrounds/gs1/Cave.gif', // Natural cave
    '/sprites/golden-sun/backgrounds/gs1/Altmillar_Cave.gif', // Rocky cave
    '/sprites/golden-sun/backgrounds/gs1/Altin_Peak.gif', // Mountain peak
    '/sprites/golden-sun/backgrounds/gs1/Lamakan_Desert.gif', // Desert wilderness
  ],

  Holy: [
    '/sprites/golden-sun/backgrounds/gs1/Venus_Lighthouse.gif', // Sacred lighthouse
    '/sprites/golden-sun/backgrounds/gs1/Mercury_Lighthouse.gif', // Holy structure
    '/sprites/golden-sun/backgrounds/gs2/Jupiter_Lighthouse.gif', // Divine tower
    '/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif', // Holy temple
  ],

  Arcane: [
    '/sprites/golden-sun/backgrounds/gs2/Anemos_Inner_Sanctum.gif', // Mystical sanctum
    '/sprites/golden-sun/backgrounds/gs2/Aqua_Rock_Inside.gif', // Water magic
    '/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif', // Ancient magic
    '/sprites/golden-sun/backgrounds/gs1/Mercury_Lighthouse.gif', // Arcane tower
  ],

  Nature: [
    '/sprites/golden-sun/backgrounds/gs1/Kolima_Forest.gif', // Lush forest
    '/sprites/golden-sun/backgrounds/gs1/Mogall_Forest.gif', // Ancient forest
    '/sprites/golden-sun/backgrounds/gs2/Gaia_Rock_Inside.gif', // Earth element
    '/sprites/golden-sun/backgrounds/gs1/Altin_Peak.gif', // Mountain nature
    '/sprites/golden-sun/backgrounds/gs1/Cave.gif', // Natural cave
  ],
};

// ============================================
// Sprite Path Builders
// ============================================

/**
 * Get sprite path for party member (dual-path: GS or Simple mode)
 */
export function getPartySpriteSet(
  unitName: string,
  weapon?: WeaponType
): PartySpriteSet | null {
  const mapping = UNIT_TO_GS_CHARACTER[unitName];
  if (!mapping) {
    console.warn(`[SpriteRegistry] No mapping for unit: ${unitName}`);
    return null;
  }

  const actualWeapon = weapon || mapping.defaultWeapon;

  if (ASSET_MODE === 'gs') {
    // Golden Sun mode - full animation set
    const char = mapping.gsCharacter; // e.g., 'isaac', 'mia', 'jenna_gs2'

    // Handle special case: jenna_gs2 folder but Jenna_ file prefix
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
    // Simple mode - reuse idle frame for all states (avoids 404s)
    const simpleMapping: Record<string, string> = {
      'Warrior': 'warrior',
      'Guardian': 'guardian',
      'Paladin': 'paladin',
      'Rogue': 'rogue',
      'Mage': 'mage',
      'Ranger': 'ranger',
      'Cleric': 'cleric',
      'Shaman': 'shaman',
      'Bard': 'bard',
      'Necromancer': 'necromancer',
      'Engineer': 'engineer',
      'Summoner': 'summoner',
    };

    const simpleName = simpleMapping[unitName];
    if (!simpleName) return null;

    const idle = `/sprites/party/${simpleName}_idle.gif`;

    // Reuse idle for all states in simple mode
    return {
      idle,
      attack1: idle,
      attack2: idle,
      hit: idle,
      downed: idle,
      cast1: idle,
      cast2: idle,
    };
  }
}

/**
 * Get sprite path for enemy
 */
export function getEnemySprite(unitName: string, role: Role): string {
  // Try direct mapping first
  const mappedSprite = ENEMY_SPRITE_MAP[unitName];
  if (mappedSprite) {
    return `/sprites/golden-sun/battle/enemies/${mappedSprite}.gif`;
  }

  // Fall back to role-based sprite
  const fallbackSprite = ROLE_FALLBACK_SPRITES[role];
  return `/sprites/golden-sun/battle/enemies/${fallbackSprite}.gif`;
}

/**
 * Get battle background (deterministic based on battle index, dual-path)
 */
export function getBattleBackground(battleIndex: number): string {
  if (ASSET_MODE === 'gs' && BATTLE_BACKGROUNDS.length > 0) {
    return BATTLE_BACKGROUNDS[battleIndex % BATTLE_BACKGROUNDS.length];
  }

  // Simple mode fallback
  const simpleBGs = ['/sprites/backgrounds/cave.gif'];
  return simpleBGs[battleIndex % simpleBGs.length];
}

/**
 * Get weapon for unit (can be extended with equipment system)
 */
export function getUnitWeapon(unitName: string): WeaponType {
  const mapping = UNIT_TO_GS_CHARACTER[unitName];
  return mapping?.defaultWeapon || 'lSword';
}

/**
 * Get battle background based on enemy tags (thematic matching)
 * Falls back to deterministic selection if no tag match
 */
export function getBattleBackgroundForTags(tags: readonly string[], fallbackIndex: number): string {
  // Try to find a background that matches one of the enemy's tags
  for (const tag of tags) {
    const options = BG_BY_TAG[tag];
    if (options && options.length > 0) {
      // Use first tag match (could be randomized if desired)
      return options[0];
    }
  }
  
  // Fall back to deterministic rotation
  return getBattleBackground(fallbackIndex);
}

// ============================================
// Psynergy Animations (Ability Visual Effects)
// ============================================

/**
 * Maps ability/spell names to Psynergy icon GIFs for visual effects
 * These display briefly when abilities are cast in battle
 */
export const PSYNERGY_ANIMATIONS: Record<string, string> = {
  // === Fire/Mars Psynergy ===
  'Fireball': '/sprites/golden-sun/icons/psynergy/Blast1.gif',
  'Volcano': '/sprites/golden-sun/icons/psynergy/Eruption.gif',
  'Inferno': '/sprites/golden-sun/icons/psynergy/Inferno.gif',
  'Fire': '/sprites/golden-sun/icons/psynergy/Blaze.gif',
  'Flame': '/sprites/golden-sun/icons/psynergy/Flare.gif',

  // === Water/Mercury Psynergy ===
  'Ply': '/sprites/golden-sun/icons/psynergy/Ply.gif',
  'Cure': '/sprites/golden-sun/icons/psynergy/Cure.gif',
  'Wish': '/sprites/golden-sun/icons/psynergy/Wish.gif',
  'Water': '/sprites/golden-sun/icons/psynergy/Douse.gif',
  'Ice': '/sprites/golden-sun/icons/psynergy/Ice.gif',
  'Frost': '/sprites/golden-sun/icons/psynergy/Frost.gif',

  // === Wind/Jupiter Psynergy ===
  'Bolt': '/sprites/golden-sun/icons/psynergy/Bolt.gif',
  'Thunder': '/sprites/golden-sun/icons/psynergy/Blue_Bolt.gif',
  'Storm': '/sprites/golden-sun/icons/psynergy/Storm_Ray.gif',
  'Whirlwind': '/sprites/golden-sun/icons/psynergy/Whirlwind.gif',
  'Wind': '/sprites/golden-sun/icons/psynergy/Gale.gif',

  // === Earth/Venus Psynergy ===
  'Quake': '/sprites/golden-sun/icons/psynergy/Quake.gif',
  'Stone': '/sprites/golden-sun/icons/psynergy/Stone_Spire.gif',
  'Spire': '/sprites/golden-sun/icons/psynergy/Spire.gif',
  'Earth': '/sprites/golden-sun/icons/psynergy/Gaia.gif',
  'Thorn': '/sprites/golden-sun/icons/psynergy/Thorn.gif',

  // === Support/Buff Psynergy ===
  'Ward': '/sprites/golden-sun/icons/psynergy/Ward.gif',
  'Impact': '/sprites/golden-sun/icons/psynergy/Impact.gif',
  'Resist': '/sprites/golden-sun/icons/psynergy/Resist.gif',
  'Barrier': '/sprites/golden-sun/icons/psynergy/Barrier.gif',

  // === Offensive Abilities ===
  'Slash': '/sprites/golden-sun/icons/psynergy/Slash.gif',
  'Blast': '/sprites/golden-sun/icons/psynergy/Astral_Blast.gif',
  'Nova': '/sprites/golden-sun/icons/psynergy/Nova.gif',
};

/**
 * Get psynergy icon for an ability
 * Returns icon path if found, null otherwise
 */
export function getPsynergyIcon(abilityName: string): string | null {
  return PSYNERGY_ANIMATIONS[abilityName] ?? null;
}

// ============================================
// Sprite Preloading
// ============================================

export async function preloadSprite(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export async function preloadCommonSprites(): Promise<void> {
  const urls = new Set<string>();

  // Preload party sprites for all mapped units
  for (const [unitName, mapping] of Object.entries(UNIT_TO_GS_CHARACTER)) {
    const spriteSet = getPartySpriteSet(unitName, mapping.defaultWeapon);
    if (spriteSet) {
      urls.add(spriteSet.idle);
      urls.add(spriteSet.attack1);
      urls.add(spriteSet.attack2);
      urls.add(spriteSet.hit);
      urls.add(spriteSet.downed);
    }
  }

  // Preload backgrounds
  for (let i = 0; i < 3; i++) {
    urls.add(getBattleBackground(i));
  }

  // Preload in parallel
  await Promise.allSettled(
    Array.from(urls).map(url => preloadSprite(url))
  );

  console.log(`[SpriteRegistry] Preloaded ${urls.size} sprites in ${ASSET_MODE} mode`);
}

