#!/usr/bin/env node

/**
 * Graphics Asset Audit Script
 * Checks for missing sprites, validates mappings, reports asset health
 */

import { existsSync, readdirSync, statSync } from 'fs';
import { join, sep } from 'path';

const ROOT = process.cwd().replace(/\\/g, '/');
const GS_ROOT = `${ROOT}/public/sprites/golden-sun`;
const SIMPLE_ROOT = `${ROOT}/public/sprites`;

// Expected poses for party sprites
const PARTY_POSES = ['Front', 'Attack1', 'Attack2', 'HitFront', 'DownedFront', 'CastFront1', 'CastFront2'];
const WEAPONS = ['lSword', 'Axe', 'lBlade', 'Mace', 'Staff', 'Bow', 'Rod'];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatPath(path) {
  return path.replace(/\\/g, '/');
}

function auditPartySprites() {
  log('\n📸 PARTY SPRITES AUDIT', 'cyan');
  log('=' .repeat(50));
  
  const partyDir = `${GS_ROOT}/battle/party`;
  if (!existsSync(partyDir)) {
    log('❌ Party directory not found!', 'red');
    return { present: 0, missing: 0, characters: [] };
  }

  const characters = readdirSync(partyDir).filter(d => 
    statSync(join(partyDir, d)).isDirectory()
  );

  let totalPresent = 0;
  let totalMissing = 0;
  const characterStats = [];

  for (const char of characters) {
    const charDir = `${partyDir}/${char}`;
    const displayName = char.includes('_') ? char.split('_')[0] : char;
    const pascalName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    
    let presentCount = 0;
    let missingCount = 0;
    const missingPoses = [];

    // Check each weapon variant
    for (const weapon of WEAPONS) {
      let weaponHasAny = false;
      
      for (const pose of PARTY_POSES) {
        const fileName = `${pascalName}_${weapon}_${pose}.gif`;
        const filePath = formatPath(`${charDir}/${fileName}`);
        
        if (existsSync(filePath)) {
          presentCount++;
          weaponHasAny = true;
        } else if (weaponHasAny || weapon === 'lSword' || weapon === 'Axe' || weapon === 'Mace') {
          // Only count as missing if this weapon type exists for this character
          missingCount++;
          missingPoses.push(`${weapon}_${pose}`);
        }
      }
    }

    totalPresent += presentCount;
    totalMissing += missingCount;

    const status = presentCount > 0 ? (missingCount === 0 ? '✅' : '⚠️') : '❌';
    log(`${status} ${char}: ${presentCount} sprites (${missingCount} missing)`, 
        missingCount === 0 ? 'green' : missingCount > 0 ? 'yellow' : 'red');
    
    if (missingPoses.length > 0 && missingPoses.length <= 5) {
      log(`   Missing: ${missingPoses.join(', ')}`, 'yellow');
    }

    characterStats.push({ char, present: presentCount, missing: missingCount });
  }

  log(`\n📊 Total: ${totalPresent} present, ${totalMissing} missing`, 'blue');
  return { present: totalPresent, missing: totalMissing, characters: characterStats };
}

function auditEnemySprites() {
  log('\n👾 ENEMY SPRITES AUDIT', 'cyan');
  log('=' .repeat(50));
  
  const enemyDir = `${GS_ROOT}/battle/enemies`;
  if (!existsSync(enemyDir)) {
    log('❌ Enemy directory not found!', 'red');
    return { count: 0, files: [] };
  }

  const enemies = readdirSync(enemyDir).filter(f => f.endsWith('.gif'));
  
  log(`✅ Found ${enemies.length} enemy sprites`, 'green');
  
  // List first 10 as examples
  const examples = enemies.slice(0, 10);
  examples.forEach(e => log(`   • ${e}`, 'green'));
  if (enemies.length > 10) {
    log(`   ... and ${enemies.length - 10} more`, 'green');
  }

  return { count: enemies.length, files: enemies };
}

function auditBackgrounds() {
  log('\n🌄 BACKGROUNDS AUDIT', 'cyan');
  log('=' .repeat(50));
  
  const gs1Dir = `${GS_ROOT}/backgrounds/gs1`;
  const gs2Dir = `${GS_ROOT}/backgrounds/gs2`;
  
  let gs1Count = 0, gs2Count = 0;
  
  if (existsSync(gs1Dir)) {
    gs1Count = readdirSync(gs1Dir).filter(f => f.endsWith('.gif')).length;
    log(`✅ GS1: ${gs1Count} backgrounds`, 'green');
  } else {
    log('❌ GS1 backgrounds directory not found!', 'red');
  }
  
  if (existsSync(gs2Dir)) {
    gs2Count = readdirSync(gs2Dir).filter(f => f.endsWith('.gif')).length;
    log(`✅ GS2: ${gs2Count} backgrounds`, 'green');
  } else {
    log('❌ GS2 backgrounds directory not found!', 'red');
  }
  
  log(`📊 Total: ${gs1Count + gs2Count} backgrounds available`, 'blue');
  
  return { gs1: gs1Count, gs2: gs2Count, total: gs1Count + gs2Count };
}

function auditPsynergy() {
  log('\n✨ PSYNERGY EFFECTS AUDIT', 'cyan');
  log('=' .repeat(50));
  
  const psynergyDir = `${GS_ROOT}/psynergy`;
  
  if (!existsSync(psynergyDir)) {
    log('❌ Psynergy directory not found!', 'red');
    return { count: 0, files: [] };
  }

  const effects = readdirSync(psynergyDir).filter(f => f.endsWith('.gif'));
  
  log(`✅ Found ${effects.length} psynergy effects`, 'green');
  
  // Categorize by element
  const fire = effects.filter(e => e.toLowerCase().includes('fire') || e.toLowerCase().includes('flame'));
  const water = effects.filter(e => e.toLowerCase().includes('water') || e.toLowerCase().includes('ice') || e.toLowerCase().includes('frost'));
  const wind = effects.filter(e => e.toLowerCase().includes('wind') || e.toLowerCase().includes('bolt') || e.toLowerCase().includes('thunder'));
  const earth = effects.filter(e => e.toLowerCase().includes('earth') || e.toLowerCase().includes('quake') || e.toLowerCase().includes('rock'));
  
  log(`   🔥 Fire: ${fire.length}`, 'red');
  log(`   💧 Water/Ice: ${water.length}`, 'blue');
  log(`   💨 Wind/Lightning: ${wind.length}`, 'magenta');
  log(`   🪨 Earth: ${earth.length}`, 'yellow');
  
  return { count: effects.length, files: effects };
}

function checkSimpleMode() {
  log('\n🎮 SIMPLE MODE FALLBACKS', 'cyan');
  log('=' .repeat(50));
  
  const partyDir = `${SIMPLE_ROOT}/party`;
  const enemyDir = `${SIMPLE_ROOT}/enemies`;
  const bgDir = `${SIMPLE_ROOT}/backgrounds`;
  
  let status = true;
  
  if (existsSync(partyDir)) {
    const count = readdirSync(partyDir).filter(f => f.endsWith('.gif')).length;
    log(`✅ Party fallbacks: ${count} sprites`, 'green');
  } else {
    log('❌ Party fallback directory missing!', 'red');
    status = false;
  }
  
  if (existsSync(enemyDir)) {
    const count = readdirSync(enemyDir).filter(f => f.endsWith('.gif')).length;
    log(`✅ Enemy fallbacks: ${count} sprites`, 'green');
  } else {
    log('❌ Enemy fallback directory missing!', 'red');
    status = false;
  }
  
  if (existsSync(bgDir)) {
    const count = readdirSync(bgDir).filter(f => f.endsWith('.gif')).length;
    log(`✅ Background fallbacks: ${count} images`, 'green');
  } else {
    log('⚠️ Background fallback directory missing', 'yellow');
  }
  
  return status;
}

function generateReport() {
  const timestamp = new Date().toISOString();
  
  log('\n' + '='.repeat(60), 'cyan');
  log('🎨 GRAPHICS ASSET AUDIT COMPLETE', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`Generated: ${timestamp}\n`, 'blue');
  
  const party = auditPartySprites();
  const enemies = auditEnemySprites();
  const backgrounds = auditBackgrounds();
  const psynergy = auditPsynergy();
  const simpleMode = checkSimpleMode();
  
  // Summary
  log('\n📊 SUMMARY', 'cyan');
  log('='.repeat(50));
  
  const summary = {
    party: party.present > 0 ? '✅' : '❌',
    enemies: enemies.count > 0 ? '✅' : '❌',
    backgrounds: backgrounds.total > 0 ? '✅' : '❌',
    psynergy: psynergy.count > 0 ? '✅' : '❌',
    simpleMode: simpleMode ? '✅' : '⚠️'
  };
  
  log(`${summary.party} Party Sprites: ${party.present} sprites ready`, party.present > 0 ? 'green' : 'red');
  log(`${summary.enemies} Enemy Sprites: ${enemies.count} enemies available`, enemies.count > 0 ? 'green' : 'red');
  log(`${summary.backgrounds} Backgrounds: ${backgrounds.total} scenes (${backgrounds.gs1} GS1, ${backgrounds.gs2} GS2)`, backgrounds.total > 0 ? 'green' : 'red');
  log(`${summary.psynergy} Psynergy Effects: ${psynergy.count} animations`, psynergy.count > 0 ? 'green' : 'red');
  log(`${summary.simpleMode} Simple Mode: Fallbacks ${simpleMode ? 'ready' : 'incomplete'}`, simpleMode ? 'green' : 'yellow');
  
  // Health score
  const healthScore = Object.values(summary).filter(v => v === '✅').length;
  const healthPercent = (healthScore / 5) * 100;
  
  log(`\n🏆 Asset Health: ${healthScore}/5 (${healthPercent}%)`, healthPercent >= 80 ? 'green' : healthPercent >= 60 ? 'yellow' : 'red');
  
  // Recommendations
  if (party.missing > 0) {
    log('\n💡 Recommendation: Some party sprites missing poses/weapons', 'yellow');
  }
  if (backgrounds.total < 20) {
    log('💡 Recommendation: Add more backgrounds for variety (have ${backgrounds.total}, recommend 20+)', 'yellow');
  }
  
  // Exit code for CI
  process.exitCode = healthPercent >= 60 ? 0 : 1;
}

// Run audit
generateReport();
