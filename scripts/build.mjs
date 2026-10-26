/** Rebuild every generated deliverable, then verify inputs and refresh this repository's manifest.
 *
 *   node scripts/build.mjs [--check]
 *
 * 1. vendor/brand/scripts/family.mjs build .  (tokens/hplx.* over the vendored Cosmik baseline)
 * 2. the HPLX asset builders: Glimmer, Ember, the Ember lockup, the Ember icon pack, the Spectral WOFF2
 * 3. scripts/verify-manifest.mjs --update-generated
 * With --check, fail unless the rebuild leaves a clean Git worktree, as cosmiklabs/brand's does.
 * Approved sources, upstream fonts, licence notices and vendor/brand are never rebuilt.
 * Run from anywhere. Node.js only; deterministic and offline. */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

export const BUILDERS = ['build-glimmer-assets.mjs', 'build-hplx-assets.mjs', 'build-hplx-lockup.mjs', 'build-icons.mjs', 'build-web-fonts.mjs'];

export function assertCleanTree(directory) {
  const changes = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { cwd: directory, encoding: 'utf8' }).trim();
  if (changes) throw new Error(`The rebuild must leave a clean worktree, including staged and new files:\n${changes}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check')) throw new Error('Usage: build.mjs [--check]');
  const node = (script, ...rest) => execFileSync(process.execPath, [script, ...rest], { stdio: 'inherit', cwd: root });
  node(path.join(root, 'vendor/brand/scripts/family.mjs'), 'build', '.');
  // The icon pack reads the Ember renders, so it runs after build-hplx-assets.
  for (const script of BUILDERS) node(path.join(here, script));
  node(path.join(here, 'verify-manifest.mjs'), '--update-generated');
  node(path.join(here, 'build-reference.mjs'));
  if (args.includes('--check')) assertCleanTree(root);
}
