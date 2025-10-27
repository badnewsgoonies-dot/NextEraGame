/**
 * Psynergy Sprite Mapping
 *
 * Maps spell IDs to their corresponding Golden Sun psynergy sprite assets.
 * Sprite files are animated GIFs from Golden Sun that play once during spell casting.
 *
 * Location: /public/sprites/psynergy/
 * Icon Location: /public/sprites/golden-sun/icons/psynergy/
 *
 * Design: Each spell is mapped to the most visually appropriate sprite.
 * When exact matches don't exist, we use thematically similar sprites.
 */

/**
 * Main spell-to-sprite mapping
 * Keys are spell IDs from elementalSpells.ts
 */
export const SPELL_TO_SPRITE: Record<string, string> = {
  // ==================== MARS (Fire) Spells ====================
  'fire_blast': '/sprites/psynergy/Fiery_Blast.gif',
  'inferno': '/sprites/psynergy/Inferno.gif',
  'ragnarok': '/sprites/psynergy/Pyroclasm.gif', // Epic fire ultimate
  'battle_cry': '/sprites/psynergy/Heat_Wave.gif', // Support spell
  'fire_ward': '/sprites/golden-sun/icons/psynergy/Resist.gif', // Defensive

  // ==================== VENUS (Earth) Spells ====================
  'stone_wall': '/sprites/golden-sun/icons/psynergy/Clay Spire.gif',
  'earthquake': '/sprites/psynergy/Grand_Gaia.gif',
  'gaia_hammer': '/sprites/golden-sun/icons/psynergy/Gaia.gif',
  'ironclad': '/sprites/golden-sun/icons/psynergy/Granite.gif', // Defense buff
  'earth_ward': '/sprites/golden-sun/icons/psynergy/Resist.gif',

  // ==================== JUPITER (Wind/Lightning) Spells ====================
  'lightning_strike': '/sprites/psynergy/Blue_Bolt.gif',
  'thunderstorm': '/sprites/psynergy/Tempest.gif',
  'thor_hammer': '/sprites/psynergy/Spark_Plasma.gif', // Epic lightning
  'wind_walk': '/sprites/golden-sun/icons/psynergy/Whirlwind.gif', // Speed buff
  'wind_ward': '/sprites/golden-sun/icons/psynergy/Resist.gif',

  // ==================== MERCURY (Water) Spells ====================
  'healing_wave': '/sprites/golden-sun/icons/psynergy/Ply.gif',
  'tidal_wave': '/sprites/psynergy/Deluge.gif',
  'poseidon_wrath': '/sprites/psynergy/Froth_Spiral.gif', // Epic water
  'cure_well': '/sprites/golden-sun/icons/psynergy/Cure.gif', // AOE heal
  'water_ward': '/sprites/golden-sun/icons/psynergy/Resist.gif',

  // ==================== MOON (Light) Spells ====================
  'divine_shield': '/sprites/golden-sun/icons/psynergy/Protect.gif',
  'divine_wrath': '/sprites/golden-sun/icons/psynergy/Angel_Spear.gif',
  'judgement': '/sprites/psynergy/Supernova.gif', // Epic light ultimate
  'revitalize': '/sprites/golden-sun/icons/psynergy/Revive.gif', // AOE heal
  'light_ward': '/sprites/golden-sun/icons/psynergy/Protect.gif',

  // ==================== SUN (Dark) Spells ====================
  'shadow_strike': '/sprites/golden-sun/icons/psynergy/Condemn.gif',
  'shadow_storm': '/sprites/psynergy/Destruct_Ray.gif', // Dark AOE
  'death_scythe': '/sprites/golden-sun/icons/psynergy/Reaper.gif', // Ultimate
  'dark_pact': '/sprites/golden-sun/icons/psynergy/Impact.gif', // Attack buff
  'dark_ward': '/sprites/golden-sun/icons/psynergy/Resist.gif',
};

/**
 * Fallback sprite if spell ID not found in map
 * Uses a generic psynergy effect
 */
export const DEFAULT_PSYNERGY_SPRITE = '/sprites/golden-sun/icons/psynergy/Beam.gif';

/**
 * Get psynergy sprite URL for a spell ID
 *
 * @param spellId - The unique spell identifier
 * @returns URL path to the sprite GIF file
 *
 * @example
 * ```ts
 * const sprite = getPsynergySprite('fire_blast');
 * // Returns: '/sprites/psynergy/Fiery_Blast.gif'
 * ```
 */
export function getPsynergySprite(spellId: string): string {
  return SPELL_TO_SPRITE[spellId] || DEFAULT_PSYNERGY_SPRITE;
}

/**
 * Determine sprite size based on spell target type
 * AOE spells use larger sprites for visual impact
 *
 * @param targetType - The spell's target specification
 * @returns Size in pixels for the sprite container
 */
export function getPsynergySpriteSize(targetType: string): number {
  // AOE spells get larger animation
  if (targetType.includes('all_')) {
    return 192; // Larger for AOE impact
  }
  // Single target spells
  return 128; // Standard size
}

/**
 * Preload critical psynergy sprites for smooth first-cast
 * Should be called on BattleScreen mount
 *
 * Preloads the most commonly used spells to avoid loading delays
 */
export function preloadPsynergySprites(): void {
  const commonSpells = [
    'fire_blast',
    'healing_wave',
    'lightning_strike',
    'stone_wall',
    'divine_shield',
    'shadow_strike',
  ];

  commonSpells.forEach(spellId => {
    const sprite = getPsynergySprite(spellId);
    const img = new Image();
    img.src = sprite;
  });
}
