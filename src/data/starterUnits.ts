/*
 * Starter Units Catalog
 * 
 * 12 balanced starter units covering all roles and tags
 * Player chooses 4 to begin their run
 * 
 * Distribution:
 * - Tanks: 3 (Holy, Nature, Holy)
 * - DPS: 3 (Beast, Arcane, Nature)
 * - Support: 3 (Holy, Nature, Arcane)
 * - Specialist: 3 (Undead, Mech, Beast)
 * 
 * Tags: All 6 represented (Undead, Mech, Beast, Holy, Arcane, Nature)
 */

import type { PlayerUnit, Element } from '../types/game.js';

export const STARTER_CATALOG: readonly PlayerUnit[] = [
  // TANKS (3)
  {
    id: 'starter_warrior',
    templateId: 'starter_warrior',
    name: 'Warrior',
    role: 'Tank',
    tags: ['Holy'],
    element: 'Moon' as Element, // Holy → Light element
    hp: 100,
    maxHp: 100,
    atk: 20,
    def: 15,
    speed: 40,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Warrior',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Isaac1.gif',
  },
  {
    id: 'starter_guardian',
    templateId: 'starter_guardian',
    name: 'Guardian',
    role: 'Tank',
    tags: ['Nature'],
    element: 'Venus' as Element, // Nature → Earth element
    hp: 110,
    maxHp: 110,
    atk: 18,
    def: 18,
    speed: 35,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Tank',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Garet1.gif',
  },
  {
    id: 'starter_paladin',
    templateId: 'starter_paladin',
    name: 'Paladin',
    role: 'Tank',
    tags: ['Holy'],
    element: 'Moon', // Holy → Light element
    hp: 95,
    maxHp: 95,
    atk: 22,
    def: 14,
    speed: 42,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Tank',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Felix1.gif',
  },

  // DPS (3)
  {
    id: 'starter_rogue',
    templateId: 'starter_rogue',
    name: 'Rogue',
    role: 'DPS',
    tags: ['Beast'],
    element: 'Mars', // Beast → Fire element
    hp: 60,
    maxHp: 60,
    atk: 35,
    def: 5,
    speed: 75,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Rogue',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Ivan.gif',
  },
  {
    id: 'starter_mage',
    templateId: 'starter_mage',
    name: 'Mage',
    role: 'DPS',
    tags: ['Arcane'],
    element: 'Mercury', // Arcane → Water element
    hp: 55,
    maxHp: 55,
    atk: 38,
    def: 3,
    speed: 65,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Mage',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Ivan.gif',
  },
  {
    id: 'starter_ranger',
    templateId: 'starter_ranger',
    name: 'Ranger',
    role: 'DPS',
    tags: ['Nature'],
    element: 'Venus', // Nature → Earth element
    hp: 65,
    maxHp: 65,
    atk: 33,
    def: 6,
    speed: 70,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Rogue',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Sheba.gif',
  },

  // SUPPORT (3)
  {
    id: 'starter_cleric',
    templateId: 'starter_cleric',
    name: 'Cleric',
    role: 'Support',
    tags: ['Holy'],
    element: 'Moon', // Holy → Light element
    hp: 70,
    maxHp: 70,
    atk: 15,
    def: 10,
    speed: 50,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Cleric',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Mia.gif',
  },
  {
    id: 'starter_shaman',
    templateId: 'starter_shaman',
    name: 'Shaman',
    role: 'Support',
    tags: ['Nature'],
    element: 'Venus', // Nature → Earth element
    hp: 75,
    maxHp: 75,
    atk: 18,
    def: 8,
    speed: 48,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Support',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Jenna1.gif',
  },
  {
    id: 'starter_bard',
    templateId: 'starter_bard',
    name: 'Bard',
    role: 'Support',
    tags: ['Arcane'],
    element: 'Mercury', // Arcane → Water element
    hp: 65,
    maxHp: 65,
    atk: 20,
    def: 7,
    speed: 55,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Support',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Sheba.gif',
  },

  // SPECIALIST (3)
  {
    id: 'starter_necromancer',
    templateId: 'starter_necromancer',
    name: 'Necromancer',
    role: 'Specialist',
    tags: ['Undead'],
    element: 'Sun', // Undead → Dark element
    hp: 60,
    maxHp: 60,
    atk: 30,
    def: 5,
    speed: 60,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Specialist',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Alex.gif',
  },
  {
    id: 'starter_engineer',
    templateId: 'starter_engineer',
    name: 'Engineer',
    role: 'Specialist',
    tags: ['Mech'],
    element: 'Jupiter', // Mech → Wind element
    hp: 70,
    maxHp: 70,
    atk: 25,
    def: 10,
    speed: 45,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Specialist',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Kraden.gif',
  },
  {
    id: 'starter_summoner',
    templateId: 'starter_summoner',
    name: 'Summoner',
    role: 'Specialist',
    tags: ['Beast'],
    element: 'Mars', // Beast → Fire element
    hp: 65,
    maxHp: 65,
    atk: 28,
    def: 6,
    speed: 52,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Specialist',
    currentMp: 50,
    portraitUrl: '/sprites/golden-sun/icons/characters/Sheba.gif',
  },
];
