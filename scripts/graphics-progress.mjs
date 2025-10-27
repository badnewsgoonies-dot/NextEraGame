#!/usr/bin/env node

/**
 * Graphics Progress Tracker
 * Shows completion status of graphics implementation
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function color(text, colorName) {
  return `${colors[colorName]}${text}${colors.reset}`;
}

function progressBar(percent, width = 30) {
  const filled = Math.round(width * (percent / 100));
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  
  if (percent >= 80) return color(bar, 'green');
  if (percent >= 50) return color(bar, 'yellow');
  return color(bar, 'red');
}

const phases = [
  {
    name: 'Phase 1: Backgrounds',
    status: 'minimal',
    percent: 4, // 3 of 72 backgrounds
    details: 'Using 3/72 available backgrounds',
    next: 'Add 15-20 more backgrounds for variety'
  },
  {
    name: 'Phase 2: Party Sprites',
    status: 'complete',
    percent: 100,
    details: 'All 12 starters mapped with animations',
    next: '✅ Complete'
  },
  {
    name: 'Phase 3: Enemy Sprites',
    status: 'complete',
    percent: 100,
    details: 'All 19 enemies mapped to GS sprites',
    next: '✅ Complete'
  },
  {
    name: 'Phase 4: UI Polish',
    status: 'partial',
    percent: 60,
    details: 'Fixed overflow, spam protection. Missing attack animations',
    next: 'Add hit flash, screen shake, damage floaters'
  },
  {
    name: 'Phase 5: Psynergy Effects',
    status: 'pending',
    percent: 0,
    details: 'No spell animations implemented yet',
    next: 'Map GS psynergy GIFs to abilities'
  },
  {
    name: 'Phase 6: Equipment Visuals',
    status: 'partial',
    percent: 30,
    details: 'Weapon variants work, no armor overlays',
    next: 'Future enhancement (needs overlay assets)'
  }
];

function getStatusEmoji(status) {
  switch(status) {
    case 'complete': return '✅';
    case 'partial': return '🔶';
    case 'minimal': return '⚠️';
    case 'pending': return '⭕';
    default: return '❓';
  }
}

function printHeader() {
  console.log('\n' + '='.repeat(60));
  console.log(color('🎨 NEXTERAGAME GRAPHICS PROGRESS TRACKER', 'cyan'));
  console.log('='.repeat(60));
  console.log(color(`Generated: ${new Date().toLocaleString()}`, 'dim'));
  console.log();
}

function printPhase(phase) {
  const emoji = getStatusEmoji(phase.status);
  const nameColor = phase.status === 'complete' ? 'green' : 
                    phase.status === 'partial' ? 'yellow' : 'red';
  
  console.log(`${emoji} ${color(phase.name, nameColor)}`);
  console.log(`   ${progressBar(phase.percent)} ${phase.percent}%`);
  console.log(`   ${color(phase.details, 'dim')}`);
  if (phase.next !== '✅ Complete') {
    console.log(`   📌 Next: ${phase.next}`);
  }
  console.log();
}

function printSummary() {
  const totalPercent = Math.round(
    phases.reduce((sum, p) => sum + p.percent, 0) / phases.length
  );
  
  const completedPhases = phases.filter(p => p.status === 'complete').length;
  const partialPhases = phases.filter(p => p.status === 'partial').length;
  const pendingPhases = phases.filter(p => p.status === 'pending' || p.status === 'minimal').length;
  
  console.log('='.repeat(60));
  console.log(color('📊 OVERALL PROGRESS', 'cyan'));
  console.log('='.repeat(60));
  
  console.log(`Overall: ${progressBar(totalPercent, 40)} ${totalPercent}%`);
  console.log();
  console.log(`✅ Complete: ${completedPhases}/${phases.length} phases`);
  console.log(`🔶 In Progress: ${partialPhases}/${phases.length} phases`);
  console.log(`⭕ Pending: ${pendingPhases}/${phases.length} phases`);
  console.log();
  
  // Priority recommendations
  console.log(color('🎯 PRIORITY RECOMMENDATIONS', 'cyan'));
  console.log('='.repeat(60));
  
  const priorities = phases
    .filter(p => p.status !== 'complete')
    .sort((a, b) => {
      // Prioritize minimal/pending over partial
      const statusOrder = { minimal: 0, pending: 1, partial: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    })
    .slice(0, 3);
  
  priorities.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   ${color(p.next, 'yellow')}`);
  });
  
  // Time estimates
  console.log();
  console.log(color('⏱️ TIME ESTIMATES', 'cyan'));
  console.log('='.repeat(60));
  console.log('Quick wins (5-20 min):');
  console.log('  • Add 15-20 backgrounds');
  console.log('  • Add hit flash effect');
  console.log('  • Fix console warnings');
  console.log();
  console.log('Medium tasks (30-60 min):');
  console.log('  • Full combat juice (flash, shake, floaters)');
  console.log('  • Psynergy effect mapping');
  console.log('  • Victory animations');
  
  // Exit code for CI
  const exitCode = totalPercent >= 50 ? 0 : 1;
  console.log();
  console.log('='.repeat(60));
  console.log(color(`Exit code: ${exitCode} (${exitCode === 0 ? 'PASS' : 'NEEDS WORK'})`, exitCode === 0 ? 'green' : 'yellow'));
  
  process.exitCode = exitCode;
}

// Run tracker
printHeader();
phases.forEach(printPhase);
printSummary();
