import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const distDir = join(process.cwd(), 'dist');

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf-8',
    env: process.env,
    ...options,
  });

  if (result.status !== 0) {
    const stdout = result.stdout ? `\nSTDOUT:\n${result.stdout}` : '';
    const stderr = result.stderr ? `\nSTDERR:\n${result.stderr}` : '';
    throw new Error(`Command failed: ${command} ${args.join(' ')}${stdout}${stderr}`);
  }

  return result;
}

before(() => {
  try {
    rmSync(distDir, { recursive: true, force: true });
  } catch {
    // ignore if directory does not exist
  }
  runCommand(npmCommand, ['run', 'build']);
});

test('build artifacts are generated', () => {
  const expectedFiles = ['styles.css', 'index.html', 'index.inline.html'].map((file) =>
    join(distDir, file),
  );

  for (const filePath of expectedFiles) {
    assert.ok(existsSync(filePath), `Expected build artifact to exist: ${filePath}`);
  }
});

test('project validation script passes', () => {
  runCommand('node', ['./scripts/validate.mjs']);
});
