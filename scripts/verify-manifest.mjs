/** Verify this repository's asset-manifest.json before refreshing hashes. Approved originals,
 * upstream fonts, licence notices and the vendored foundation are inputs; a build must never
 * approve changed bytes. Adapted from cosmiklabs/brand's scripts/verify-manifest.mjs.
 *
 *   node scripts/verify-manifest.mjs [--update-generated]
 *
 * Every file under assets/, icons/, tokens/, fonts/ (Markdown aside) and vendor/brand/ must be
 * listed with its SHA-256. `brand` names the foundation in vendor/brand/brand.lock.json, and
 * `distribution` is what consumers sync with vendor.mjs: every file this manifest describes plus
 * every file under vendor/brand/, including its lock, so a consumer verifies both layers. Both are
 * derived, never hand-edited, and `version` must be the family's version in tokens/family.json.
 * With --update-generated, the hashes of generated and editable files are refreshed, and `version`,
 * `brand` and `distribution` are rewritten from their sources; nothing is written if any other
 * problem remains. Works in a release archive without Git. Node.js only. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VENDOR_DIR = 'vendor/brand';
export const LOCK = `${VENDOR_DIR}/brand.lock.json`;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rectangle = value => Array.isArray(value) && value.length === 4 && value.every(Number.isFinite) && value[2] > 0 && value[3] > 0;
const portablePath = value => typeof value === 'string' && value.length > 0 && !value.includes('\\') && !value.includes(':') && !value.includes('\0') && !value.startsWith('/') && value.split('/').every(part => part && part !== '.' && part !== '..');
const generatorPath = value => portablePath(value) && (value.startsWith('scripts/') || value.startsWith(`${VENDOR_DIR}/scripts/`));

/** The `brand` reference to the vendored foundation, and its files as distribution entries, from the lock. */
export function fromLock(directory) {
  const bytes = fs.readFileSync(path.join(directory, LOCK));
  const lock = JSON.parse(bytes.toString('utf8'));
  return {
    brand: { repository: lock.repository, tag: lock.tag, commit: lock.commit, directory: VENDOR_DIR, lock: LOCK },
    files: [{ path: LOCK, sha256: sha256(bytes) }, ...Object.keys(lock.files).map(file => ({ path: `${VENDOR_DIR}/${file}`, sha256: lock.files[file] }))],
  };
}

/** The distribution a manifest implies: its own entries' recorded hashes plus the foundation's. */
export function distributionFor(own, foundationFiles) {
  const files = [...own.map(e => ({ path: e.path, sha256: e.sha256 })), ...foundationFiles].sort((a, b) => (a.path < b.path ? -1 : 1));
  return {
    description: 'Every file a consumer syncs from a release of this repository with vendor/brand/scripts/vendor.mjs sync, with its SHA-256: the HPLX tokens, Glimmer and historical Ember marks, icons, Spectral with its notice, guides and licence, and the Cosmik foundation under vendor/brand/ unchanged with its lock. `vendor.mjs verify` checks both layers.',
    files,
  };
}

export function verifyManifest(directory, { updateGenerated = false } = {}) {
  const file = path.join(directory, 'asset-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  const problems = [], entries = [], updates = [];

  // The family version and the brand reference have one source each.
  let expected;
  try { expected = fromLock(directory); }
  catch (error) { problems.push(`cannot read ${LOCK}: ${error.message}`); }
  let familyVersion;
  try { familyVersion = JSON.parse(fs.readFileSync(path.join(directory, 'tokens/family.json'), 'utf8')).version; }
  catch (error) { problems.push(`cannot read tokens/family.json: ${error.message}`); }
  if (updateGenerated) {
    if (familyVersion) manifest.version = familyVersion;
    if (expected) manifest.brand = expected.brand;
    delete manifest.vendor;
  }
  if (familyVersion && manifest.version !== familyVersion) problems.push(`version ${manifest.version} is not the family version ${familyVersion} in tokens/family.json`);
  if (expected && JSON.stringify(manifest.brand) !== JSON.stringify(expected.brand)) problems.push(`brand differs from ${LOCK}; run node scripts/build.mjs after vendor.mjs sync`);
  if ('vendor' in manifest) problems.push('vendor is replaced by brand and distribution; run node scripts/build.mjs');

  const walk = node => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      // A damaged entry must not disappear from validation when its hash is removed.
      if ('path' in node || 'sha256' in node) entries.push(node);
      Object.values(node).forEach(walk);
    }
  };
  // `distribution` repeats files described elsewhere; it is derived and compared below.
  const { distribution, ...described } = manifest;
  walk(described);
  const listed = new Set();
  const notices = new Set((manifest.font_licenses ?? []).map(e => e.path));
  if (manifest.license) notices.add(manifest.license);
  const realRoot = fs.realpathSync(directory);
  const read = relative => {
    if (!portablePath(relative)) { problems.push(`invalid repository-relative path: ${String(relative)}`); return; }
    const full = path.join(directory, relative);
    if (!fs.existsSync(full)) { problems.push(`missing file: ${relative}`); return; }
    const real = fs.realpathSync(full);
    if (!real.startsWith(realRoot + path.sep)) { problems.push(`file escapes repository: ${relative}`); return; }
    if (!fs.statSync(full).isFile()) { problems.push(`not a regular file: ${relative}`); return; }
    return fs.readFileSync(full);
  };
  for (const entry of entries) {
    const p = entry.path;
    if (listed.has(p)) problems.push(`duplicate file entry: ${p}`);
    listed.add(p);
    if (!/^[a-f0-9]{64}$/.test(entry.sha256 ?? '')) problems.push(`invalid or missing SHA-256: ${p}`);
    if ('editable' in entry && typeof entry.editable !== 'boolean') problems.push(`editable must be boolean: ${p}`);
    if (entry.generated_by !== undefined) {
      if (!generatorPath(entry.generated_by)) problems.push(`invalid generator path: ${p}`);
      else if (!fs.existsSync(path.join(directory, entry.generated_by))) problems.push(`missing generator ${entry.generated_by}: ${p}`);
    }
    if (typeof p === 'string' && p.startsWith(`${VENDOR_DIR}/`)) problems.push(`vendored file listed outside distribution: ${p}`);
    const protectedInput = notices.has(p) || entry.source_bytes_unchanged || entry.role?.kind === 'approved-original' || (typeof p === 'string' && /\.(ttf|otf)$/.test(p));
    if (protectedInput && (entry.generated_by || entry.editable)) problems.push(`immutable input must not be generated or editable: ${p}`);
    const bytes = read(p);
    if (bytes) {
      const actual = sha256(bytes);
      if (updateGenerated && !protectedInput && (entry.generated_by || entry.editable === true)) updates.push([entry, actual]);
      else if (actual !== entry.sha256) problems.push(`hash mismatch: ${p}`);
      if (typeof p === 'string' && p.endsWith('.svg')) {
        const declared = typeof entry.viewBox === 'string' ? entry.viewBox.trim().split(/[\s,]+/).map(Number) : entry.viewBox;
        const actualViewBox = bytes.toString('utf8').match(/<svg\b[^>]*\bviewBox="([^"]+)"/)?.[1].trim().split(/[\s,]+/).map(Number);
        if (!rectangle(declared)) problems.push(`invalid or missing viewBox: ${p}`);
        else if (JSON.stringify(actualViewBox) !== JSON.stringify(declared)) problems.push(`SVG viewBox differs from manifest: ${p}`);
        if (!rectangle(entry.visible_bounds_xywh)) problems.push(`invalid or missing visible_bounds_xywh: ${p}`);
      }
      if (typeof p === 'string' && p.endsWith('.png') && entry.dimensions_px) {
        if (bytes.length < 24 || bytes.toString('hex', 0, 8) !== '89504e470d0a1a0a' || JSON.stringify(entry.dimensions_px) !== JSON.stringify([bytes.readUInt32BE(16), bytes.readUInt32BE(20)])) problems.push(`PNG dimensions differ from manifest: ${p}`);
      }
    }
    if ('visible_bounds' in entry) problems.push(`legacy visible_bounds key: ${p}`);
  }
  // The foundation's bytes must be the locked bytes; vendor.mjs verify reports the detail.
  for (const { path: p, sha256: hash } of expected?.files ?? []) {
    listed.add(p);
    const bytes = read(p);
    if (bytes && sha256(bytes) !== hash) problems.push(`vendored file differs from ${LOCK}: ${p}`);
  }
  const fonts = [...(manifest.web_fonts ?? []), ...(manifest.desktop_fonts ?? [])];
  for (const font of fonts) {
    if (!font.license_file) problems.push(`font has no license_file: ${font.path}`);
    else if (!notices.has(font.license_file) || !listed.has(font.license_file)) problems.push(`font notice not listed with a hash: ${font.license_file}`);
  }
  if (manifest.license && !listed.has(manifest.license)) problems.push(`repository licence not listed with a hash: ${manifest.license}`);
  const entryPoints = [];
  const leaves = node => {
    if (typeof node === 'string') entryPoints.push(node);
    else if (node && typeof node === 'object') Object.values(node).forEach(leaves);
    else problems.push('entry points must contain paths, arrays or objects');
  };
  leaves(manifest.entry_points);
  for (const p of entryPoints) if (!listed.has(p)) problems.push(`entry point not listed with a hash: ${p}`);

  // Distribution directories are an inventory, not a hand-picked subset. This catches a new export
  // that a builder writes, or a vendored file, without a manifest entry.
  const inventory = (relative, { markdown = false } = {}) => {
    const full = path.join(directory, relative);
    if (!fs.existsSync(full)) return;
    for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
      const p = `${relative}/${entry.name}`;
      if (entry.isDirectory()) inventory(p, { markdown });
      else if ((markdown || !p.endsWith('.md')) && !listed.has(p)) problems.push(`distribution file not listed with a hash: ${p}`);
    }
  };
  for (const part of ['assets', 'icons', 'tokens', 'fonts']) inventory(part);
  inventory(VENDOR_DIR, { markdown: true });
  // The distribution follows the refreshed hashes, so it is compared after them.
  const derive = () => distributionFor(entries.filter(e => portablePath(e.path) && !e.path.startsWith(`${VENDOR_DIR}/`)), expected?.files ?? []);
  if (!updateGenerated && JSON.stringify(distribution) !== JSON.stringify(derive())) problems.push('distribution differs from the manifest entries and the lock; run node scripts/build.mjs');
  // Do not partially bless generated output when another input is damaged.
  if (updateGenerated && !problems.length) {
    for (const [entry, hash] of updates) entry.sha256 = hash;
    manifest.distribution = derive();
    fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
  }
  return { files: entries.length, distributed: derive().files.length, entry_points: entryPoints.length, problems };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--update-generated')) throw new Error('Usage: verify-manifest.mjs [--update-generated]');
  const result = verifyManifest(root, { updateGenerated: args.includes('--update-generated') });
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.problems.length ? 1 : 0;
}
