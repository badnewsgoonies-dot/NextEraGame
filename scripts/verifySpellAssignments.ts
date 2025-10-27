/**
 * Manual Verification Script: Spell Assignments
 *
 * Run with: npx tsx scripts/verifySpellAssignments.ts
 *
 * Shows which spells each starter unit receives based on their element + gem
 */

import { initializeUnitSpells } from '../src/systems/ElementSystem';
import { STARTER_CATALOG } from '../src/data/starterUnits';

console.log('=== SPELL ASSIGNMENT VERIFICATION ===\n');

STARTER_CATALOG.forEach(unit => {
  const initialized = initializeUnitSpells(unit);

  console.log(`${unit.name} (${unit.element}):`);
  console.log(`  Role: ${unit.role}`);
  console.log(`  Gem: ${unit.activeGemState.activeGem?.element || 'None'}`);
  console.log(`  Spells (${initialized.learnedSpells.length}):`);

  if (initialized.learnedSpells.length > 0) {
    initialized.learnedSpells.forEach(spell => {
      console.log(`    - ${spell.name} (${spell.mpCost} MP) - ${spell.effect.type}`);
    });
  } else {
    console.log(`    - (No spells)`);
  }
  console.log('');
});

console.log('=== SUMMARY ===');
console.log(`Total starters: ${STARTER_CATALOG.length}`);
const totalSpells = STARTER_CATALOG.map(u => initializeUnitSpells(u).learnedSpells.length).reduce((a, b) => a + b, 0);
console.log(`Total spells granted: ${totalSpells}`);
console.log(`Average spells per unit: ${(totalSpells / STARTER_CATALOG.length).toFixed(1)}`);
