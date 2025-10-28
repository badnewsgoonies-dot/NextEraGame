/**
 * Psynergy Sprite Mapping
 *
 * Maps spell IDs to their Golden Sun psynergy sprite assets.
 * Sprite files are located in: /public/sprites/psynergy/
 * These are animated GIFs from Golden Sun that play once.
 *
 * Available sprites (19 total):
 * - Blue_Bolt.gif, Deluge.gif, Destruct_Ray.gif, Dragon_Fire.gif
 * - Fiery_Blast.gif, Freeze_Prism.gif, Froth_Spiral.gif, Fume.gif
 * - Glacier.gif, Grand_Gaia.gif, Heat_Wave.gif, Ice_Missile.gif
 * - Inferno.gif, Nettle.gif, Pyroclasm.gif, Sonic_Slash.gif
 * - Spark_Plasma.gif, Supernova.gif, Tempest.gif
 *
 * Mapping strategy:
 * - Direct matches where possible (inferno → Inferno.gif)
 * - Thematic matches for similar spells (fire_blast → Fiery_Blast.gif)
 * - Reuse sprites for buff/ward spells (use defensive-looking effects)
 */

// ============================================
// Spell ID to Sprite Mapping
// ============================================

export const SPELL_TO_SPRITE: Record<string, string> = {
  // =====================
  // MARS (Fire) Spells
  // =====================
  fire_blast: '/sprites/psynergy/Fiery_Blast.gif',
  inferno: '/sprites/psynergy/Inferno.gif',
  ragnarok: '/sprites/psynergy/Pyroclasm.gif',
  battle_cry: '/sprites/psynergy/Heat_Wave.gif', // Support spell (fiery aura)

  // =====================
  // MERCURY (Water) Spells
  // =====================
  healing_wave: '/sprites/psynergy/Froth_Spiral.gif',
  cure_well: '/sprites/psynergy/Deluge.gif', // Party heal (water waves)
  tidal_wave: '/sprites/psynergy/Glacier.gif',
  poseidon_wrath: '/sprites/psynergy/Ice_Missile.gif',

  // =====================
  // JUPITER (Wind/Lightning) Spells
  // =====================
  lightning_strike: '/sprites/psynergy/Blue_Bolt.gif',
  thunderstorm: '/sprites/psynergy/Spark_Plasma.gif', // AOE lightning
  thor_hammer: '/sprites/psynergy/Destruct_Ray.gif', // Ultimate lightning
  wind_walk: '/sprites/psynergy/Sonic_Slash.gif', // Support (wind movement)

  // =====================
  // VENUS (Earth) Spells
  // =====================
  stone_wall: '/sprites/psynergy/Nettle.gif', // Defensive earth
  earthquake: '/sprites/psynergy/Grand_Gaia.gif',
  gaia_hammer: '/sprites/psynergy/Grand_Gaia.gif', // Reuse (similar effect)
  ironclad: '/sprites/psynergy/Nettle.gif', // Reuse (earth defense)

  // =====================
  // MOON (Light) Spells
  // =====================
  divine_shield: '/sprites/psynergy/Freeze_Prism.gif', // Shimmering protective shield
  divine_wrath: '/sprites/psynergy/Supernova.gif', // Holy explosion
  judgement: '/sprites/psynergy/Dragon_Fire.gif', // Divine judgment beam
  revitalize: '/sprites/psynergy/Freeze_Prism.gif', // Reuse (healing shimmer)

  // =====================
  // SUN (Dark) Spells
  // =====================
  shadow_strike: '/sprites/psynergy/Fume.gif',
  shadow_storm: '/sprites/psynergy/Tempest.gif',
  death_scythe: '/sprites/psynergy/Destruct_Ray.gif', // Reuse (similar beam effect)
  dark_pact: '/sprites/psynergy/Fume.gif', // Reuse (dark aura)

  // =====================
  // COUNTER WARDS (Defensive)
  // =====================
  // All wards use Nettle (defensive earth barrier visual)
  fire_ward: '/sprites/psynergy/Nettle.gif',
  water_ward: '/sprites/psynergy/Nettle.gif',
  wind_ward: '/sprites/psynergy/Nettle.gif',
  earth_ward: '/sprites/psynergy/Nettle.gif',
  light_ward: '/sprites/psynergy/Freeze_Prism.gif', // Light = crystalline
  dark_ward: '/sprites/psynergy/Fume.gif', // Dark = shadowy
};

// ============================================
// Fallback Sprite
// ============================================

/**
 * Default sprite if spell ID not found in map
 */
export const DEFAULT_PSYNERGY_SPRITE = '/sprites/psynergy/Nettle.gif';

// ============================================
// Helper Functions
// ============================================

/**
 * Get psynergy sprite URL for a spell ID
 * Returns the sprite path or fallback if not found
 */
export function getPsynergySprite(spellId: string): string {
  return SPELL_TO_SPRITE[spellId] || DEFAULT_PSYNERGY_SPRITE;
}

/**
 * Check if a spell has a psynergy sprite mapped
 */
export function hasPsynergySprite(spellId: string): boolean {
  return spellId in SPELL_TO_SPRITE;
}

/**
 * Get all spell IDs that use a specific sprite
 * Useful for understanding sprite reuse
 */
export function getSpellsForSprite(spritePath: string): string[] {
  return Object.entries(SPELL_TO_SPRITE)
    .filter(([_, path]) => path === spritePath)
    .map(([spellId, _]) => spellId);
}
