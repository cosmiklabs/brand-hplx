/** This repository builds on a vendored, locked cosmiklabs/brand release. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verify, LOCK} from '../vendor/brand/scripts/vendor.mjs';
import {expectedExtends} from '../vendor/brand/scripts/family.mjs';
import {loadBaseline, brandRoot} from '../vendor/brand/scripts/generate-tokens.mjs';
import {fromLock} from '../scripts/verify-manifest.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vendored = path.join(root, 'vendor/brand');
const lock = JSON.parse(fs.readFileSync(path.join(vendored, LOCK), 'utf8'));
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

test('the manifest names the locked release and lists every vendored file for consumers', () => {
  const expected = fromLock(root);
  assert.deepEqual(manifest.vendor, expected.vendor);
  for (const key of ['repository', 'tag', 'commit']) assert.equal(manifest.brand[key], lock[key]);
  assert.equal(manifest.vendor.files.length, Object.keys(lock.files).length);
  assert.equal(manifest.version, JSON.parse(fs.readFileSync(path.join(root, 'tokens/family.json'), 'utf8')).version);
});
