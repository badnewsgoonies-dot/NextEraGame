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
    element: 'Mars' as Element, // Offensive/Aggressive - Tank but offensive
    activeGemState: {
      activeGem: {
        id: 'gem_mars_starter',
        element: 'Mars',
        name: 'Mars Gem',
        description: 'Starter fire element gem',
        icon: '🔥',
      },
      isActivated: true,
    },
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
    activeGemState: {
      activeGem: {
        id: 'gem_venus_starter',
        element: 'Venus',
        name: 'Venus Gem',
        description: 'Starter earth element gem',
        icon: '🌿',
      },
      isActivated: true,
    },
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
    element: 'Venus', // Defensive/Sturdy - Tank, holy warrior
    activeGemState: {
      activeGem: {
        id: 'gem_venus_starter',
        element: 'Venus',
        name: 'Venus Gem',
        description: 'Starter earth element gem',
        icon: '🌿',
      },
      isActivated: true,
    },
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
    activeGemState: {
      activeGem: {
        id: 'gem_mars_starter',
        element: 'Mars',
        name: 'Mars Gem',
        description: 'Starter fire element gem',
        icon: '🔥',
      },
      isActivated: true,
    },
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
    element: 'Moon', // Holy/Protective - DPS, light magic
    activeGemState: {
      activeGem: {
        id: 'gem_moon_starter',
        element: 'Moon',
        name: 'Moon Gem',
        description: 'Starter light element gem',
        icon: '🌙',
      },
      isActivated: true,
    },
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
    element: 'Jupiter', // Fast/Support - DPS, agile
    activeGemState: {
      activeGem: {
        id: 'gem_jupiter_starter',
        element: 'Jupiter',
        name: 'Jupiter Gem',
        description: 'Starter wind element gem',
        icon: '💨',
      },
      isActivated: true,
    },
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
    element: 'Mercury', // Healing/Adaptive - Support, healer
    activeGemState: {
      activeGem: {
        id: 'gem_mercury_starter',
        element: 'Mercury',
        name: 'Mercury Gem',
        description: 'Starter water element gem',
        icon: '💧',
      },
      isActivated: true,
    },
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
    element: 'Mercury', // Healing/Adaptive - Support, water magic
    activeGemState: {
      activeGem: {
        id: 'gem_mercury_starter',
        element: 'Mercury',
        name: 'Mercury Gem',
        description: 'Starter water element gem',
        icon: '💧',
      },
      isActivated: true,
    },
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
    element: 'Jupiter', // Fast/Support - Support, inspiring
    activeGemState: {
      activeGem: {
        id: 'gem_jupiter_starter',
        element: 'Jupiter',
        name: 'Jupiter Gem',
        description: 'Starter wind element gem',
        icon: '💨',
      },
      isActivated: true,
    },
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
    activeGemState: {
      activeGem: {
        id: 'gem_sun_starter',
        element: 'Sun',
        name: 'Sun Gem',
        description: 'Starter dark element gem',
        icon: '☀️',
      },
      isActivated: true,
    },
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
    element: 'Sun', // Mysterious/Technical - Specialist, unconventional
    activeGemState: {
      activeGem: {
        id: 'gem_sun_starter',
        element: 'Sun',
        name: 'Sun Gem',
        description: 'Starter dark element gem',
        icon: '☀️',
      },
      isActivated: true,
    },
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
    element: 'Moon', // Holy/Protective - Specialist, holy summons
    activeGemState: {
      activeGem: {
        id: 'gem_moon_starter',
        element: 'Moon',
        name: 'Moon Gem',
        description: 'Starter light element gem',
        icon: '🌙',
      },
      isActivated: true,
    },
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
