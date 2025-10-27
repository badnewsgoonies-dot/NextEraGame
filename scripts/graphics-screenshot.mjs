#!/usr/bin/env node

/**
 * Graphics Screenshot Capture Tool
 * Automatically captures screenshots for documentation
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SCREENSHOTS_DIR = join(ROOT, 'docs', 'screenshots');

// Ensure screenshots directory exists
if (!existsSync(SCREENSHOTS_DIR)) {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const routes = [
  { path: '/', name: 'home', wait: 2000 },
  { path: '/battle', name: 'battle', wait: 3000 },
  { path: '/starter-select', name: 'starter-select', wait: 2000 },
  { path: '/gem-select', name: 'gem-select', wait: 2000 },
  { path: '/equipment', name: 'equipment', wait: 2000 },
];

async function captureScreenshots() {
  console.log('📸 Starting screenshot capture...\n');
  
  // Start dev server
  console.log('Starting dev server...');
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    shell: true
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  for (const route of routes) {
    const screenshotPath = join(SCREENSHOTS_DIR, `${timestamp}-${route.name}.png`);
    console.log(`📸 Capturing ${route.name}...`);
    
    // Use Playwright or Puppeteer here if available
    // For now, just log what would be captured
    console.log(`   Would capture: http://localhost:3000${route.path}`);
    console.log(`   Save to: ${screenshotPath}`);
    console.log(`   Wait: ${route.wait}ms\n`);
  }
  
  // Kill server
  server.kill();
  console.log('✅ Screenshot capture complete!');
}

// Note: This is a stub - would need Playwright/Puppeteer for actual capture
console.log('⚠️ Note: This tool requires Playwright or Puppeteer to be installed.');
console.log('Install with: npm install --save-dev playwright');
console.log('Then update this script to use actual screenshot capture.\n');

captureScreenshots().catch(console.error);
