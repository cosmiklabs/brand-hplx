/** This repository builds on a vendored, locked cosmiklabs/brand release. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verify, sync, distributionSet} from '../vendor/brand/scripts/vendor.mjs';
import {execFileSync} from 'node:child_process';
import {expectedExtends} from '../vendor/brand/scripts/family.mjs';
import {loadBaseline, brandRoot} from '../vendor/brand/scripts/generate-tokens.mjs';
import {fromLock, LOCK} from '../scripts/verify-manifest.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vendored = path.join(root, 'vendor/brand');
const lock = JSON.parse(fs.readFileSync(path.join(root, LOCK), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'asset-manifest.json'), 'utf8'));

test('the vendored foundation verifies against its lock', () => {
  const result = verify(vendored);
  assert.deepEqual(result.problems, []);
  assert.equal(lock.repository, 'cosmiklabs/brand');
  assert.match(lock.tag, /^v\d+\.\d+\.\d+$/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(vendored, 'package.json'), 'utf8')).version, lock.tag.slice(1));
});

test('the family API used here is the vendored copy, resolving the vendored baseline', () => {
  assert.equal(fs.realpathSync(brandRoot), fs.realpathSync(vendored));
});

test('tokens/family.json extends the vendored baseline', () => {
  const family = JSON.parse(fs.readFileSync(path.join(root, 'tokens/family.json'), 'utf8'));
  assert.equal(family.extends, expectedExtends(loadBaseline(vendored)));
});

test('a changed, missing or extra vendored file fails verification', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'brand-hplx-vendor-'));
  t.after(() => fs.rmSync(dir, {recursive: true, force: true}));
  fs.cpSync(vendored, dir, {recursive: true});
  fs.appendFileSync(path.join(dir, 'scripts/family.mjs'), '\n');
  fs.rmSync(path.join(dir, 'guide/voice.md'));
  fs.writeFileSync(path.join(dir, 'extra.txt'), 'not in the release');
  const problems = verify(dir).problems.join('\n');
  assert.match(problems, /modified: scripts\/family\.mjs/);
  assert.match(problems, /missing: guide\/voice\.md/);
  assert.match(problems, /extra: extra\.txt/);
});

test('the manifest names the locked release and distributes both layers to consumers', () => {
  const expected = fromLock(root);
  assert.deepEqual(manifest.brand, expected.brand);
  assert.deepEqual(Object.keys(manifest.brand), ['repository', 'tag', 'commit', 'directory', 'lock']);
  assert.equal('vendor' in manifest, false);
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const set = distributionSet(manifest, pkg);
  assert.equal(set.repository, 'cosmiklabs/brand-hplx');
  const listed = new Map(set.files.map(e => [e.path, e.sha256]));
  for (const {path: p, sha256} of expected.files) assert.equal(listed.get(p), sha256, p);
  assert.ok(listed.has(LOCK));
  assert.ok(![...listed.keys()].some(p=>/ember|hplx-lockup|HISTORICAL/.test(p)));
  for (const p of ['LICENSE.md', 'README.md', 'tokens/hplx.css', 'fonts/web/Spectral-SemiBold.woff2', 'fonts/licenses/Spectral-OFL.txt', 'assets/hplx-glimmer-dark.svg']) assert.ok(listed.has(p), p);
  assert.equal(manifest.version, JSON.parse(fs.readFileSync(path.join(root, 'tokens/family.json'), 'utf8')).version);
  assert.equal(pkg.version, manifest.version);
});

test('a release of this repository syncs into a consumer and verifies both layers', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'brand-hplx-release-'));
  t.after(() => fs.rmSync(dir, {recursive: true, force: true}));
  const repo = path.join(dir, 'brand-hplx');
  for (const p of [...manifest.distribution.files.map(e => e.path), 'asset-manifest.json', 'package.json']) {
    fs.mkdirSync(path.dirname(path.join(repo, p)), {recursive: true});
    fs.copyFileSync(path.join(root, p), path.join(repo, p));
  }
  const config = path.join(dir, 'empty.gitconfig');
  fs.writeFileSync(config, '');
  const git = (...args) => execFileSync('git', args, {cwd: repo, stdio: 'pipe', env: {...process.env, GIT_CONFIG_GLOBAL: config, GIT_CONFIG_SYSTEM: config}});
  git('init', '-q');
  git('add', '-A');
  git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'release');
  git('tag', `v${manifest.version}`);
  const into = path.join(dir, 'consumer/vendor/brand-hplx');
  assert.equal(sync({from: repo, into}).package, '@cosmiklabs/brand-hplx');
  assert.ok(fs.existsSync(path.join(into, 'brand-hplx.lock.json')));
  const result = verify(into, {release: repo});
  assert.deepEqual(result.problems, []);
  assert.deepEqual(result.layers.map(l => [l.directory, l.lock.repository]), [['.', 'cosmiklabs/brand-hplx'], ['vendor/brand', 'cosmiklabs/brand']]);
  fs.appendFileSync(path.join(into, 'vendor/brand/kits/cosmik/tokens/cosmik.css'), '\n');
  const found = verify(into).problems;
  assert.ok(found.includes(`modified: vendor/brand/kits/cosmik/tokens/cosmik.css differs from cosmiklabs/brand-hplx v${manifest.version}`), found.join('\n'));
  assert.ok(found.includes(`modified: vendor/brand/kits/cosmik/tokens/cosmik.css differs from ${lock.repository} ${lock.tag}`), found.join('\n'));
});
