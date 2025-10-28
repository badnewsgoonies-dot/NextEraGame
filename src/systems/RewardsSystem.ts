/**
 * Rewards System
 *
 * Calculates battle rewards based on defeated enemies.
 * Uses deterministic seeded RNG for consistent drops.
 *
 * Drop Rates:
 * - Items: 60% chance (health potion)
 * - Equipment: 20% chance (weapon/armor/accessory)
 * - Gold: Always (enemy.level * 10)
 * - XP: Always (enemy.level * 25)
 *
 * Example:
 * Level 5 Skeleton defeated:
 * - Gold: 50 (5 * 10)
 * - XP: 125 (5 * 25)
 * - Item: 60% chance → Health Potion
 * - Equipment: 20% chance → Random gear based on level
 */

import type { Item, Equipment, EnemyUnitTemplate } from '../types/game.js';
import type { IRng } from '../utils/rng.js';

/**
 * Battle rewards structure
 */
export interface BattleRewards {
  readonly items: Item[];
  readonly equipment: Equipment[];
  readonly gold: number;
  readonly xp: number;
}

/**
 * Create a health potion item
 */
function createHealthPotion(): Item {
  return {
    id: `health-potion-${Date.now()}-${Math.random()}`,
    name: 'Health Potion',
    type: 'consumable',
    description: 'Restores 50 HP',
    rarity: 'common',
    stats: {
      hpRestore: 50,
    },
  };
}

/**
 * Generate random equipment based on enemy level
 * Higher level enemies drop better equipment
 */
function generateRandomEquipment(
  slotType: 'weapon' | 'armor' | 'accessory',
  enemyLevel: number,
  rng: IRng
): Equipment {
  const rarity = enemyLevel >= 10 ? 'rare' : enemyLevel >= 5 ? 'uncommon' : 'common';
  const statBonus = enemyLevel + rng.int(-2, 2); // ±2 variance

  const id = `${slotType}-${Date.now()}-${rng.int(0, 999999)}`;

  switch (slotType) {
    case 'weapon':
      return {
        id,
        name: rarity === 'rare' ? 'Legendary Sword' : rarity === 'uncommon' ? 'Steel Blade' : 'Iron Sword',
        slot: 'weapon',
        description: `A ${rarity} weapon`,
        rarity,
        stats: {
          atk: Math.max(1, statBonus),
        },
      };
    case 'armor':
      return {
        id,
        name: rarity === 'rare' ? 'Legendary Armor' : rarity === 'uncommon' ? 'Steel Plate' : 'Iron Armor',
        slot: 'armor',
        description: `A ${rarity} armor`,
        rarity,
        stats: {
          def: Math.max(1, statBonus),
        },
      };
    case 'accessory':
      return {
        id,
        name: rarity === 'rare' ? 'Legendary Ring' : rarity === 'uncommon' ? 'Silver Ring' : 'Bronze Ring',
        slot: 'accessory',
        description: `A ${rarity} accessory`,
        rarity,
        stats: {
          speed: Math.max(1, Math.floor(statBonus / 2)),
        },
      };
  }
}

/**
 * Calculate battle rewards based on defeated enemies
 *
 * Uses seeded RNG for deterministic drops.
 *
 * @param defeatedEnemies - Array of defeated enemy templates
 * @param rng - Seeded RNG for deterministic drops
 * @returns Battle rewards (items, equipment, gold, XP)
 */
export function calculateBattleRewards(
  defeatedEnemies: readonly EnemyUnitTemplate[],
  rng: IRng
): BattleRewards {
  let totalGold = 0;
  let totalXp = 0;
  const items: Item[] = [];
  const equipment: Equipment[] = [];

  for (const _enemy of defeatedEnemies) {
    // Assume level 5 if not present (for now)
    const enemyLevel = 5; // TODO: Get from enemy when level is added to EnemyUnitTemplate

    // Always give gold and XP
    totalGold += enemyLevel * 10;
    totalXp += enemyLevel * 25;

    // 60% chance for item drop
    if (rng.float() < 0.6) {
      const item = createHealthPotion();
      items.push(item);
    }

    // 20% chance for equipment drop
    if (rng.float() < 0.2) {
      const equipType = rng.int(0, 2); // 0=weapon, 1=armor, 2=accessory
      const equip = generateRandomEquipment(
        equipType === 0 ? 'weapon' : equipType === 1 ? 'armor' : 'accessory',
        enemyLevel,
        rng
      );
      equipment.push(equip);
    }
  }

  return {
    items,
    equipment,
    gold: totalGold,
    xp: totalXp,
  };
}
