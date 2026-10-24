/** Checks the repository; exits non-zero on the first failing step.
 *
 * 1. vendor/brand/scripts/vendor.mjs verify vendor/brand  (the foundation is exactly the locked release)
 * 2. vendor/brand/scripts/family.mjs check .              (contract, extends, generated drift, contrast)
 * 3. scripts/verify-manifest.mjs                           (every deliverable listed and hashed)
 * 4. every test in tests/
 * Run from anywhere: node scripts/check.mjs. Node.js only. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const node = (...args) => execFileSync(process.execPath, args, { stdio: 'inherit', cwd: root });
try {
  node(path.join(root, 'vendor/brand/scripts/vendor.mjs'), 'verify', 'vendor/brand');
  node(path.join(root, 'vendor/brand/scripts/family.mjs'), 'check', '.');
  node(path.join(here, 'verify-manifest.mjs'));
  // Discovered, so a new test can never be skipped by forgetting to list it.
  const tests = path.join(root, 'tests');
  const files = fs.readdirSync(tests).filter(f => f.endsWith('.test.mjs')).sort().map(f => path.join(tests, f));
  node('--test', ...files);
} catch (error) {
  process.exitCode = error.status || 1;
}
