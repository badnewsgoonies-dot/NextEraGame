/*
 * RewardSystem: Generate battle rewards deterministically
 * 
 * Features:
 * - Deterministic item drops based on RNG seed
 * - Difficulty affects drop rate and quality
 * - Experience rewards based on battle length
 * - Defeated enemies available for recruitment
 */

import type { IRng } from '../utils/rng.js';
import type { 
  BattleReward, 
  OpponentSpec, 
  BattleResult,
  Item,
  Equipment,
  Difficulty,
  GemChoice
} from '../types/game.js';
import { ITEM_CATALOG } from '../data/items.js';
import type { ILogger } from './Logger.js';

export class RewardSystem {
  constructor(private readonly logger: ILogger) {}

  /**
   * Generate battle rewards deterministically
   */
  generateRewards(
    opponentSpec: OpponentSpec,
    battleResult: BattleResult,
    rng: IRng
  ): BattleReward {
    // Base experience = 10 * turnsTaken
    const baseExp = battleResult.turnsTaken * 10;
    
    // Difficulty multiplier
    const expMultiplier = opponentSpec.difficulty === 'Hard' ? 2.0
                        : opponentSpec.difficulty === 'Normal' ? 1.5
                        : 1.0;
    
    const experience = Math.floor(baseExp * expMultiplier);

    // Roll for item drops
    const items = this.rollItems(rng, opponentSpec.difficulty);

    // Generate equipment drops
    const equipment = this.generateEquipment(
      opponentSpec.difficulty,
      rng,
      opponentSpec.units.length
    );

    // Generate gem choices (NEW - Choice System)
    const gemChoices = this.generateGemChoices(rng, opponentSpec.difficulty);

    // Only return actually defeated enemies (not all opponent units)
    const defeatedEnemies = opponentSpec.units.filter(unit =>
      battleResult.unitsDefeated.includes(unit.id)
    );

    this.logger.info('rewards:generated', {
      opponentId: opponentSpec.id,
      difficulty: opponentSpec.difficulty,
      experience,
      itemCount: items.length,
      equipmentCount: equipment.length,
      gemChoiceCount: gemChoices.length,
      defeatedCount: defeatedEnemies.length,
    });

    return {
      items,
      defeatedEnemies,
      experience,
      equipment,
      gemChoices, // NEW!
    };
  }

  /**
   * Roll for item drops
   * Difficulty affects both drop rate and rarity
   */
  private rollItems(rng: IRng, difficulty: Difficulty): Item[] {
    const items: Item[] = [];

    // Drop rate by difficulty
    const dropRate = difficulty === 'Hard' ? 0.8 
                   : difficulty === 'Normal' ? 0.5 
                   : 0.3;

    // Number of drop attempts (1-3 based on difficulty)
    const maxDrops = difficulty === 'Hard' ? 3 
                   : difficulty === 'Normal' ? 2 
                   : 1;

    for (let i = 0; i < maxDrops; i++) {
      if (rng.float() < dropRate) {
        const item = this.rollSingleItem(rng, difficulty);
        items.push(item);
      }
    }

    return items;
  }

  /**
   * Roll a single item
   * Difficulty affects rarity distribution
   */
  private rollSingleItem(rng: IRng, difficulty: Difficulty): Item {
    // Rarity roll
    const rarityRoll = rng.float();
    
    let rarity: 'common' | 'rare' | 'epic';
    if (difficulty === 'Hard') {
      // Hard: 20% epic, 40% rare, 40% common
      rarity = rarityRoll > 0.8 ? 'epic'
             : rarityRoll > 0.4 ? 'rare'
             : 'common';
    } else if (difficulty === 'Normal') {
      // Normal: 5% epic, 30% rare, 65% common
      rarity = rarityRoll > 0.95 ? 'epic'
             : rarityRoll > 0.65 ? 'rare'
             : 'common';
    } else {
      // Standard: 1% epic, 15% rare, 84% common
      rarity = rarityRoll > 0.99 ? 'epic'
             : rarityRoll > 0.84 ? 'rare'
             : 'common';
    }

    // Filter items by rarity
    const itemsOfRarity = ITEM_CATALOG.filter(i => i.rarity === rarity);
    
    if (itemsOfRarity.length === 0) {
      // Fallback to common if no items of this rarity
      return rng.choose(ITEM_CATALOG.filter(i => i.rarity === 'common'));
    }

    return rng.choose(itemsOfRarity);
  }

  /**
   * Generate equipment drops from battle
   * Drop rate and rarity affected by difficulty
   */
  private generateEquipment(
    difficulty: Difficulty,
    rng: IRng,
    enemyCount: number
  ): Equipment[] {
    const equipment: Equipment[] = [];
    
    // Drop chance per enemy
    const dropChance = difficulty === 'Hard' ? 0.4
                     : difficulty === 'Normal' ? 0.3
                     : 0.2;
    
    for (let i = 0; i < enemyCount; i++) {
      if (rng.float() > dropChance) continue;
      
      // Random slot
      const slots = ['weapon', 'armor', 'accessory'] as const;
      const slot = slots[rng.int(0, 2)];
      
      // Random rarity (simplified distribution)
      const rarityRoll = rng.float();
      const rarity = rarityRoll > 0.95 ? 'epic'
                   : rarityRoll > 0.80 ? 'rare'
                   : rarityRoll > 0.60 ? 'uncommon'
                   : 'common';
      
      // Stat bonuses based on rarity
      const baseBonus = rarity === 'epic' ? 20
                      : rarity === 'rare' ? 15
                      : rarity === 'uncommon' ? 10
                      : 5;
      
      // Stats based on slot type
      const stats = slot === 'weapon' ? { atk: baseBonus }
                  : slot === 'armor' ? { def: baseBonus }
                  : { speed: baseBonus }; // accessory
      
      equipment.push({
        id: `equip-${Date.now()}-${rng.int(1000, 9999)}`,
        name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${slot.charAt(0).toUpperCase() + slot.slice(1)}`,
        description: `A ${rarity} ${slot} found in battle`,
        slot,
        stats,
        rarity,
      });
    }
    
    return equipment;
  }

  /**
   * Generate gem choices (NEW - Choice System)
   * Player always gets 3 gem choices after battle
   * Tier and element are deterministic based on difficulty and RNG
   */
  private generateGemChoices(rng: IRng, difficulty: Difficulty): GemChoice[] {
    const choices: GemChoice[] = [];
    const elements = ['Fire', 'Water', 'Earth', 'Wind'] as const;
    
    // Always generate 3 gem choices
    for (let i = 0; i < 3; i++) {
      // Select element
      const element = rng.choose(elements);
      
      // Determine tier based on difficulty
      const tierRoll = rng.float();
      let tier: number;
      
      if (difficulty === 'Hard') {
        // Hard: 30% tier 3, 50% tier 2, 20% tier 1
        tier = tierRoll > 0.7 ? 3 : tierRoll > 0.2 ? 2 : 1;
      } else if (difficulty === 'Normal') {
        // Normal: 10% tier 3, 60% tier 2, 30% tier 1
        tier = tierRoll > 0.9 ? 3 : tierRoll > 0.3 ? 2 : 1;
      } else {
        // Standard: 5% tier 3, 30% tier 2, 65% tier 1
        tier = tierRoll > 0.95 ? 3 : tierRoll > 0.65 ? 2 : 1;
      }
      
      // Calculate boost based on tier
      const boost = tier === 3 ? 25 : tier === 2 ? 15 : 10;
      
      // Generate gem
      const gem: GemChoice = {
        id: `${element.toLowerCase()}_${tier}_${i}`,
        name: `${tier === 3 ? 'Supreme' : tier === 2 ? 'Greater' : ''} ${element} Gem`.trim(),
        element,
        tier,
        boost,
      };
      
      choices.push(gem);
    }
    
    return choices;
  }

  /**
   * Calculate gold reward (future feature)
   */
  calculateGold(opponentSpec: OpponentSpec): number {
    const baseGold = 50;
    const multiplier = opponentSpec.difficulty === 'Hard' ? 3
                     : opponentSpec.difficulty === 'Normal' ? 2
                     : 1;
    
    return baseGold * multiplier * opponentSpec.units.length;
  }
}
