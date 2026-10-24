import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyManifest} from '../scripts/verify-manifest.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** A scratch copy of the repository's distributed files. */
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'brand-hplx-manifest-'));
  t.after(() => fs.rmSync(dir, {recursive: true, force: true}));
  for (const part of ['asset-manifest.json', 'package.json', 'LICENSE.md', 'README.md', 'EMBER-HISTORICAL.md', 'assets', 'icons', 'tokens', 'fonts', 'vendor', 'scripts']) {
    fs.cpSync(path.join(root, part), path.join(dir, part), {recursive: true});
  }
  return dir;
}
const has = (result, pattern) => assert.ok(result.problems.some(p => pattern.test(p)), JSON.stringify(result.problems));

test('the committed manifest lists and hashes every deliverable', () => {
  assert.deepEqual(verifyManifest(root).problems, []);
});

test('unlisted exports and edited vendored files are reported, and nothing is blessed', t => {
  const dir = fixture(t);
  fs.writeFileSync(path.join(dir, 'assets/hplx-new.svg'), '<svg/>');
  fs.appendFileSync(path.join(dir, 'vendor/brand/kits/cosmik/tokens/cosmik.css'), '/* edited */');
  const before = fs.readFileSync(path.join(dir, 'asset-manifest.json'));
  const result = verifyManifest(dir, {updateGenerated: true});
  has(result, /distribution file not listed.*assets\/hplx-new\.svg/);
  has(result, /vendored file differs.*cosmik\.css/);
  assert.deepEqual(fs.readFileSync(path.join(dir, 'asset-manifest.json')), before);
});

test('approved sources, fonts and notices are never rehashed by a build', t => {
  const dir = fixture(t);
  for (const p of ['assets/ember.source.json', 'fonts/desktop/Spectral-SemiBold.ttf', 'fonts/licenses/Spectral-OFL.txt', 'LICENSE.md']) fs.appendFileSync(path.join(dir, p), 'x');
  const result = verifyManifest(dir, {updateGenerated: true});
  for (const p of [/ember\.source\.json/, /Spectral-SemiBold\.ttf/, /Spectral-OFL\.txt/, /LICENSE\.md/]) has(result, p);
});

test('a stale brand reference, distribution or version is reported until a build refreshes it', t => {
  const dir = fixture(t);
  const file = path.join(dir, 'asset-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.distribution.files.pop();
  manifest.brand.tag = 'v0.0.1';
  manifest.version = '9.9.9';
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
  const stale = verifyManifest(dir);
  has(stale, /distribution differs/);
  has(stale, /brand differs/);
  has(stale, /version 9\.9\.9/);
  assert.deepEqual(verifyManifest(dir, {updateGenerated: true}).problems, []);
  assert.deepEqual(verifyManifest(dir).problems, []);
});

test('a build refreshes a generated file\'s entry and its distribution hash together', t => {
  const dir = fixture(t);
  fs.appendFileSync(path.join(dir, 'tokens/hplx.css'), '/* stale */');
  const result = verifyManifest(dir);
  has(result, /hash mismatch: tokens\/hplx\.css/);
  assert.deepEqual(verifyManifest(dir, {updateGenerated: true}).problems, []);
  const saved = JSON.parse(fs.readFileSync(path.join(dir, 'asset-manifest.json'), 'utf8'));
  const entry = saved.tokens.find(e => e.path === 'tokens/hplx.css');
  assert.equal(saved.distribution.files.find(e => e.path === 'tokens/hplx.css').sha256, entry.sha256);
});
