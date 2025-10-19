#!/usr/bin/env node

import chokidar from 'chokidar';
import { spawn } from 'node:child_process';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

console.log('[watch] Starting HTML file watcher...');

// Watch for changes in src directory
const watcher = chokidar.watch([
  path.join(root, 'src/**/*.html'),
  path.join(root, 'src/**/*.json'),
  path.join(root, 'dist/styles.css')
], {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 150,
    pollInterval: 50
  }
});

// Debounce rebuild to avoid multiple builds
let rebuildTimeout;
function triggerRebuild() {
  clearTimeout(rebuildTimeout);
  rebuildTimeout = setTimeout(() => {
    console.log('[watch] Changes detected, rebuilding HTML...');
    const build = spawn('node', [path.join(root, 'scripts/build.mjs'), '--keep-css=true'], {
      stdio: 'inherit',
      cwd: root
    });
    
    build.on('close', (code) => {
      if (code === 0) {
        console.log('[watch] ✓ HTML rebuilt successfully');
      } else {
        console.error('[watch] ✗ Build failed');
      }
    });
  }, 300);
}

watcher
  .on('change', (filePath) => {
    console.log(`[watch] Changed: ${path.relative(root, filePath)}`);
    triggerRebuild();
  })
  .on('add', (filePath) => {
    console.log(`[watch] Added: ${path.relative(root, filePath)}`);
    triggerRebuild();
  })
  .on('unlink', (filePath) => {
    console.log(`[watch] Removed: ${path.relative(root, filePath)}`);
    triggerRebuild();
  })
  .on('error', (error) => {
    console.error('[watch] Error:', error);
  });

console.log('[watch] Watching for changes in src/ directory...');

