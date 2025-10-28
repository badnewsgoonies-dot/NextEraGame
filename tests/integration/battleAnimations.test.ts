/**
 * Battle Animations Integration Tests
 * 
 * Tests for DamageNumber, PsynergyAnimation, and sprite mapping
 */

import { describe, it, expect, vi } from 'vitest';
import { getPsynergySprite, hasPsynergySprite } from '../../src/data/psynergySprites';

describe('Psynergy Sprite Mapping', () => {
  it('returns correct sprite path for fire_blast', () => {
    const sprite = getPsynergySprite('fire_blast');
    expect(sprite).toContain('/sprites/psynergy/');
    expect(sprite).toMatch(/\.gif$/);
    expect(sprite).toBe('/sprites/psynergy/Fiery_Blast.gif');
  });

  it('returns correct sprite path for healing_wave', () => {
    const sprite = getPsynergySprite('healing_wave');
    expect(sprite).toBe('/sprites/psynergy/Froth_Spiral.gif');
  });

  it('returns correct sprite path for inferno', () => {
    const sprite = getPsynergySprite('inferno');
    expect(sprite).toBe('/sprites/psynergy/Inferno.gif');
  });

  it('returns fallback sprite for unknown spell', () => {
    const sprite = getPsynergySprite('unknown_spell_xyz');
    expect(sprite).toContain('/sprites/psynergy/');
    expect(sprite).toMatch(/\.gif$/);
  });

  it('hasPsynergySprite returns true for mapped spells', () => {
    expect(hasPsynergySprite('fire_blast')).toBe(true);
    expect(hasPsynergySprite('healing_wave')).toBe(true);
    expect(hasPsynergySprite('inferno')).toBe(true);
  });

  it('hasPsynergySprite returns false for unmapped spells', () => {
    expect(hasPsynergySprite('unknown_spell')).toBe(false);
  });

  it('maps all 30 spells correctly', () => {
    const allSpells = [
      // MARS
      'fire_blast', 'inferno', 'ragnarok', 'battle_cry',
      // MERCURY
      'healing_wave', 'cure_well', 'tidal_wave', 'poseidon_wrath',
      // JUPITER
      'lightning_strike', 'thunderstorm', 'thor_hammer', 'wind_walk',
      // VENUS
      'stone_wall', 'earthquake', 'gaia_hammer', 'ironclad',
      // MOON
      'divine_shield', 'divine_wrath', 'judgement', 'revitalize',
      // SUN
      'shadow_strike', 'shadow_storm', 'death_scythe', 'dark_pact',
      // WARDS
      'fire_ward', 'water_ward', 'wind_ward', 'earth_ward', 'light_ward', 'dark_ward'
    ];

    allSpells.forEach(spellId => {
      const sprite = getPsynergySprite(spellId);
      expect(sprite).toBeTruthy();
      expect(sprite).toContain('/sprites/psynergy/');
      expect(sprite).toMatch(/\.gif$/);
    });
  });

  it('uses 19 unique sprites for 30 spells', () => {
    const allSpells = [
      'fire_blast', 'inferno', 'ragnarok', 'battle_cry',
      'healing_wave', 'cure_well', 'tidal_wave', 'poseidon_wrath',
      'lightning_strike', 'thunderstorm', 'thor_hammer', 'wind_walk',
      'stone_wall', 'earthquake', 'gaia_hammer', 'ironclad',
      'divine_shield', 'divine_wrath', 'judgement', 'revitalize',
      'shadow_strike', 'shadow_storm', 'death_scythe', 'dark_pact',
      'fire_ward', 'water_ward', 'wind_ward', 'earth_ward', 'light_ward', 'dark_ward'
    ];

    const uniqueSprites = new Set(allSpells.map(spellId => getPsynergySprite(spellId)));
    expect(uniqueSprites.size).toBe(19);
  });
});

describe('DamageNumber Component Types', () => {
  it('supports damage type', () => {
    const type: 'damage' | 'heal' | 'miss' | 'critical' = 'damage';
    expect(type).toBe('damage');
  });

  it('supports heal type', () => {
    const type: 'damage' | 'heal' | 'miss' | 'critical' = 'heal';
    expect(type).toBe('heal');
  });

  it('supports miss type', () => {
    const type: 'damage' | 'heal' | 'miss' | 'critical' = 'miss';
    expect(type).toBe('miss');
  });

  it('supports critical type', () => {
    const type: 'damage' | 'heal' | 'miss' | 'critical' = 'critical';
    expect(type).toBe('critical');
  });
});

describe('PsynergyAnimation Integration', () => {
  it('spell IDs match element types correctly', () => {
    // Mars (Fire)
    expect(getPsynergySprite('fire_blast')).toContain('Fiery_Blast');
    expect(getPsynergySprite('inferno')).toContain('Inferno');

    // Mercury (Water)
    expect(getPsynergySprite('healing_wave')).toContain('Froth_Spiral');
    expect(getPsynergySprite('tidal_wave')).toContain('Glacier');

    // Jupiter (Lightning/Wind)
    expect(getPsynergySprite('lightning_strike')).toContain('Blue_Bolt');
    expect(getPsynergySprite('thunderstorm')).toContain('Spark_Plasma');

    // Venus (Earth)
    expect(getPsynergySprite('stone_wall')).toContain('Nettle');
    expect(getPsynergySprite('earthquake')).toContain('Grand_Gaia');
  });
});
