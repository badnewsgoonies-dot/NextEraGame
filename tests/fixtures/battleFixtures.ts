/*
 * Battle System Test Fixtures
 * Mock teams for testing battle mechanics
 */

import type { PlayerUnit, EnemyUnitTemplate, Tag, Role } from '../../src/types/game.js';

export const mockPlayerTeam: PlayerUnit[] = [
  {
    id: 'p1',
    templateId: 'test_warrior',
    name: 'Warrior',
    role: 'Tank' as Role,
    tags: ['Holy'] as Tag[],
    element: 'Moon',
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
    luck: 5,
  },
  {
    id: 'p2',
    templateId: 'test_rogue',
    name: 'Rogue',
    role: 'DPS' as Role,
    tags: ['Beast'] as Tag[],
    element: 'Mars',
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
    luck: 5,
  },
];

export const mockEnemyTemplates: EnemyUnitTemplate[] = [
  {
    id: 'e1',
    name: 'Skeleton Warrior',
    role: 'Tank' as Role,
    tags: ['Undead'] as Tag[],
    baseStats: {
      hp: 80,
      atk: 15,
      def: 10,
      speed: 35,
    },
  },
  {
    id: 'e2',
    name: 'Zombie',
    role: 'Tank' as Role,
    tags: ['Undead'] as Tag[],
    baseStats: {
      hp: 90,
      atk: 18,
      def: 8,
      speed: 25,
    },
  },
];

// Single weak enemy for quick tests
export const weakEnemy: EnemyUnitTemplate = {
  id: 'e_weak',
  name: 'Goblin',
  role: 'DPS' as Role,
  tags: ['Beast'] as Tag[],
  baseStats: {
    hp: 30,
    atk: 10,
    def: 3,
    speed: 50,
  },
};

// Single strong enemy
export const strongEnemy: EnemyUnitTemplate = {
  id: 'e_strong',
  name: 'Dragon',
  role: 'Specialist' as Role,
  tags: ['Beast', 'Arcane'] as Tag[],
  baseStats: {
    hp: 200,
    atk: 40,
    def: 20,
    speed: 60,
  },
};

// Fast unit (goes first)
export const fastUnit: PlayerUnit = {
  id: 'p_fast',
  templateId: 'test_assassin',
  name: 'Assassin',
  role: 'DPS' as Role,
  tags: ['Undead'] as Tag[],
  element: 'Sun',
  hp: 50,
  maxHp: 50,
  atk: 30,
  def: 3,
  speed: 100, // Fastest
  level: 1,
  experience: 0,
  rank: 'C',
  baseClass: 'Rogue',
  currentMp: 50,
  luck: 5,
};

// Slow unit (goes last)
export const slowUnit: PlayerUnit = {
  id: 'p_slow',
  templateId: 'test_knight',
  name: 'Heavy Knight',
  role: 'Tank' as Role,
  tags: ['Holy'] as Tag[],
  element: 'Moon',
  hp: 150,
  maxHp: 150,
  atk: 25,
  def: 25,
  speed: 20, // Slowest
  level: 1,
  experience: 0,
  rank: 'C',
  baseClass: 'Tank',
  currentMp: 50,
  luck: 5,
};

