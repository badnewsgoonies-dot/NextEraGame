/**
 * Test demonstration for getGrantedSpells function
 *
 * This file shows how to properly use getGrantedSpells with correct parameters.
 */

import { getGrantedSpells } from './src/systems/ElementSystem.js';
import { MARS_GEM, VENUS_GEM, JUPITER_GEM, MERCURY_GEM, MOON_GEM, SUN_GEM } from './src/data/gems.js';
import type { ActiveGemState, Element } from './src/types/game.js';

console.log('=== Testing getGrantedSpells Function ===\n');

// Test 1: Matching Element (Fire unit with Fire gem)
console.log('Test 1: Mars unit with Mars gem (MATCHING)');
const marsGemState: ActiveGemState = {
  activeGem: MARS_GEM,
  isActivated: false,
};
const marsSpells = getGrantedSpells('Mars', marsGemState);
console.log('Result:', JSON.stringify(marsSpells, null, 2));
console.log('Expected: Fire Blast spell');
console.log('');

// Test 2: Counter Element (Water unit with Fire gem)
console.log('Test 2: Mercury unit with Mars gem (COUNTER)');
const counterGemState: ActiveGemState = {
  activeGem: MARS_GEM,
  isActivated: false,
};
const counterSpells = getGrantedSpells('Mercury', counterGemState);
console.log('Result:', JSON.stringify(counterSpells, null, 2));
console.log('Expected: Fire Ward spell (defensive ward against fire)');
console.log('');

// Test 3: Neutral Element (Earth unit with Fire gem)
console.log('Test 3: Venus unit with Mars gem (NEUTRAL)');
const neutralGemState: ActiveGemState = {
  activeGem: MARS_GEM,
  isActivated: false,
};
const neutralSpells = getGrantedSpells('Venus', neutralGemState);
console.log('Result:', JSON.stringify(neutralSpells, null, 2));
console.log('Expected: Empty array (no bonus spells for neutral relationship)');
console.log('');

// Test 4: No Active Gem
console.log('Test 4: Mars unit with no active gem');
const noGemState: ActiveGemState = {
  activeGem: null,
  isActivated: false,
};
const noGemSpells = getGrantedSpells('Mars', noGemState);
console.log('Result:', JSON.stringify(noGemSpells, null, 2));
console.log('Expected: Empty array (no gem = no bonus spells)');
console.log('');

// Test 5: All Elements with Matching Gems
console.log('Test 5: All elements with matching gems');
const elements: Element[] = ['Mars', 'Venus', 'Jupiter', 'Mercury', 'Moon', 'Sun'];
const gems = [MARS_GEM, VENUS_GEM, JUPITER_GEM, MERCURY_GEM, MOON_GEM, SUN_GEM];

elements.forEach((element, index) => {
  const gemState: ActiveGemState = {
    activeGem: gems[index],
    isActivated: false,
  };
  const spells = getGrantedSpells(element, gemState);
  console.log(`${element} + ${gems[index].name}:`, spells.length > 0 ? spells[0].name : 'No spells');
});

console.log('\n=== All Tests Complete ===');
