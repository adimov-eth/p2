#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, cpSync } from 'fs';
import { join, resolve } from 'path';

// Copy necessary files to static folder before build
const files = [
  { src: '../dist/server.js', dest: 'static/server.js' },
  { src: '../jurisdictions.json', dest: 'static/jurisdictions.json' }
];

for (const file of files) {
  const srcPath = resolve(file.src);
  const destPath = resolve(file.dest);

  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${file.src} → ${file.dest}`);
  } else {
    console.log(`⚠️ Source file not found: ${file.src}`);
  }
}

// Copy scenarios directory (skip if already symlinked)
const scenariosSrc = resolve('../scenarios');
const scenariosDest = resolve('static/scenarios');
try {
  const { lstatSync } = await import('fs');
  const stats = lstatSync(scenariosDest);
  if (stats.isSymbolicLink()) {
    console.log(`ℹ️  static/scenarios is symlinked - skipping copy`);
  } else {
    throw new Error('Not a symlink');
  }
} catch {
  // Not symlinked, do the copy
  if (existsSync(scenariosSrc)) {
    mkdirSync(scenariosDest, { recursive: true });
    cpSync(scenariosSrc, scenariosDest, { recursive: true });
    console.log(`✅ Copied scenarios/ → static/scenarios/`);
  }
}

console.log('📦 Static files copied for build');
