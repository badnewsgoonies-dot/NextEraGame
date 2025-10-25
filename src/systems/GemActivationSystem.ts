/**
 * Gem Activation System
 * 
 * Handles execution of gem activation effects (party-wide abilities).
 * Triggered when player activates gem mid-battle.
 */

import type { PlayerUnit } from '../types/game.js';
import type { GemActivation } from '../data/gemActivations.js';

export interface GemActivationResult {
  readonly updatedPlayerUnits: readonly PlayerUnit[];
  readonly updatedEnemies: readonly PlayerUnit[]; // Using PlayerUnit for enemies temporarily
  readonly message: string;
}

/**
 * Execute gem activation effect
 * @param activation - Activation ability data
 * @param playerUnits - Current player units
 * @param enemies - Current enemy units
 * @returns Updated units and message
 */
export function executeGemActivation(
  activation: GemActivation,
  playerUnits: readonly PlayerUnit[],
  enemies: readonly PlayerUnit[]
): GemActivationResult {
  let message = '';
  let updatedPlayerUnits = [...playerUnits];
  let updatedEnemies = [...enemies];

  switch (activation.effect) {
    case 'aoe_damage': {
      // Damage all enemies
      updatedEnemies = enemies.map(enemy => {
        const newHp = Math.max(0, enemy.hp - activation.power);
        return { ...enemy, hp: newHp };
      });
      
      message = `${activation.name} deals ${activation.power} damage to all enemies!`;
      break;
    }
    
    case 'party_heal': {
      // Heal all allies
      updatedPlayerUnits = playerUnits.map(unit => {
        const newHp = Math.min(unit.maxHp, unit.hp + activation.power);
        return { ...unit, hp: newHp };
      });
      
      message = `${activation.name} heals all allies for ${activation.power} HP!`;
      break;
    }
    
    case 'party_buff':
    case 'enemy_debuff':
      // TODO: Implement buff/debuff system if not already present
      message = `${activation.name} activated!`;
      break;
    
    default:
      message = `${activation.name} activated!`;
      break;
  }

  return {
    updatedPlayerUnits,
    updatedEnemies,
    message,
  };
}
