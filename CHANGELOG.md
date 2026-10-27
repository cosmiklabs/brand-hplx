# Changes

## Unreleased

- Removed retired Ember artwork, lockups, platform icons, source files, guide and builders. Removed historical manifest entry points and the Historical page. Current consumers should use the Glimmer entry points; older consumers can pin their existing release or recover retired files from Git history.

The family version (`version` in `tokens/family.json`, also the manifest and
package version) follows semver. The Cosmik foundation this family builds on is
pinned separately in `vendor/brand/brand.lock.json`. Newest first.

## 0.2.0 · 26 October 2026

- **Licence.** `LICENSE.md` names COSMIK LABS, LLC as the holder of the copyright
  in this repository's own material and of the marks, including the HPLX marks, in
  place of "not a company or other legal entity", the contributors and the
  organisation's owner. The MIT notice reads "Copyright (c) 2026 COSMIK LABS, LLC".
  Sections, grants and permissions are otherwise unchanged. The change applies
  from this release.
- **Foundation `cosmiklabs/brand` v0.16.1** (commit
  `4da5ba28b1c32cf6b717ca1cb579b6c6d237ec3d`), synced with its `vendor.mjs` from
  v0.11.0. The baseline token version moves from 0.7.0 to **0.11.0**, so
  `extends` is `"Cosmik baseline 0.11.0"`. Between the two: pressed is a deeper
  step of hover (0.15.1), glass keeps the theme's tone and is legible over any
  backdrop through a per-tone backdrop filter (0.16.0), the same licence change
  (0.16.1), and the shared controls and guide changes in between. See the
  foundation's [changelog](https://github.com/cosmiklabs/brand/blob/v0.16.1/CHANGELOG.md).
- **Pressed states continue hover.** The foundation's contract now requires each
  rest → hover → pressed ramp to move one way. HPLX's rest and hover colours are
  unchanged; only the pressed step moves:
  - dark primary: `hplx-amber-active` `#C98F2A` → `#F3C97E`, one step lighter
    than the hover `#EBB75C` (it went darker than rest);
  - dark secondary: `#0E0F11` (ink, darker than rest) → new `hplx-raised-pressed`
    `#2A2F35`, one step lighter than the hover `#1E2226`;
  - light secondary: `#F3EFE6` (vellum, back towards rest) → new
    `hplx-parchment-pressed` `#DCD3C2`, one step deeper than the hover `#E7E0D2`.
- **Dark glass tint.** New `hplx-glass-dark` `#0E0F1160` (38 %, HPLX ink) for the
  dark `glass` role: over the baseline's 31 % tint, HPLX's bone secondary text on
  the pressed glass tint reached 4.14:1 over the worst backdrop; at 38 % it is 4.52:1
  (4.5:1 required). The light tone keeps the baseline's tint.
- All 218 contrast pairs pass. The new pressed and glass values await owner review;
  no mark, font or rest-state colour changes.

## 0.1.2 · 24 October 2026

- **Foundation `cosmiklabs/brand` v0.11.0** (commit
  `1a7d5c392dd6926eaa8625c496a707de1a4b4d1b`), synced with its `vendor.mjs`. Its
  shared controls add `c-status--dense`: the status pill, roles and `label` family,
  tracking and case at the `ui-small` size with tighter padding, for dense rows,
  headers and cards. `c-status` is unchanged. See the foundation's
  [changelog](https://github.com/cosmiklabs/brand/blob/v0.11.0/CHANGELOG.md).
- No HPLX token value, mark, palette or font changes. Generated tokens differ only
  in the version and the provenance header; `extends` stays `Cosmik baseline 0.7.0`.

## 0.1.1 · 24 October 2026

- **Foundation `cosmiklabs/brand` v0.10.0** (commit
  `c3bf1a7b2e34ff764a069e96c5c86ff29316f7b4`), synced with its `vendor.mjs`. Its
  shared controls change: `c-status` now reads as a label (the `label` type role, a
  pill shape, no interaction affordance); `c-select--dense` and `c-input--dense`
  add dense fields that return to the standard target and body size on touch; and
  `c-button--large` adds a taller call-to-action button. See
  `vendor/brand/CHANGELOG.md`.
- No HPLX token value, mark, palette or font changes. Generated tokens differ only
  in the version and the provenance header; `extends` stays `Cosmik baseline 0.7.0`.

## 0.1.0 · split from cosmiklabs/brand · 24 October 2026

This repository continues the HPLX family that lived in
[`cosmiklabs/brand`](https://github.com/cosmiklabs/brand) under `kits/hplx/` up to
release 0.7.0. The family stays at **0.1.0**: no token value, mark, palette or font
changes.

- **History.** `kits/hplx/` was split out of `cosmiklabs/brand` with its history
  (`git subtree split` at 6bf3c86, the 0.7.0 merge), so its files now sit at the
  repository root: `tokens/`, `assets/`, `icons/`, `README.md` and
  `EMBER-HISTORICAL.md`.
- **Foundation.** `cosmiklabs/brand` v0.9.1 is vendored at `vendor/brand/` with
  its `vendor.mjs sync`; `brand.lock.json` (`lockfileVersion` 2) records the
  package, repository, tag, commit (48afb82b1edd5f9a7ce01eedbd52b5e3484c3c69) and the
  SHA-256 of all 36 files. It was first vendored from v0.8.0 during the split.
  `tokens/family.json` still extends `Cosmik baseline 0.7.0`, which v0.9.1 provides.
- **Spectral moved here.** `fonts/desktop/Spectral-SemiBold.ttf`,
  `fonts/web/Spectral-SemiBold.woff2` and `fonts/licenses/Spectral-OFL.txt` come from
  `cosmiklabs/brand` 0.7.0 byte for byte; `scripts/build-web-fonts.mjs` rebuilds the
  same WOFF2.
- **Tokens** are generated by the vendored `family.mjs`. The only change from 0.7.0 is
  the provenance header of `hplx.css`, `hplx.tokens.json` and `hplx_tokens.rs`,
  which names `@cosmiklabs/brand 0.9.1`;
  `hplx.json` is byte-identical.
- **Tooling.** The Glimmer, Ember, Ember lockup, Ember icon and Spectral web-font
  builders are ported to this layout, using the vendored `font-outlines.mjs` and
  `vector-raster.mjs`; every regenerated asset is byte-identical to 0.7.0.
  `scripts/build.mjs` and `scripts/check.mjs` wrap the vendored family build and
  check, `vendor.mjs verify`, the manifest and the tests. CI also proves the lock
  against the recorded tag.
- **Manifest.** `asset-manifest.json` carries over the HPLX entries, statuses and
  known gaps from `cosmiklabs/brand` 0.7.0 under paths relative to this repository.
  It has the shape `brand-tectra` shares: `brand` names the foundation
  (`repository`, `tag`, `commit`, `directory`, `lock`), and `distribution` lists,
  with SHA-256, every file a consumer syncs: the HPLX tokens, marks, icons,
  Spectral and its notice, the guides and `LICENSE.md`, and every file under
  `vendor/brand/` including its lock. The build derives both, and the check fails
  when the manifest, the lock and the files disagree.
- **Consumption.** Products sync a release with
  `node <brand-hplx>/vendor/brand/scripts/vendor.mjs sync --from <brand-hplx> --into vendor/brand-hplx`
  and check both layers with `verify vendor/brand-hplx`; see the README.
  `package.json` names the `repository` the lock records.
- **Licence.** `LICENSE.md` carries over the terms that applied to `kits/hplx/` and
  Spectral; the vendored foundation keeps its own `vendor/brand/LICENSE.md`.

### Migration for consumers

- Replace `kits/hplx/<path>` with `<path>` from this repository (for example
  `kits/hplx/tokens/hplx.css` becomes `tokens/hplx.css`) and
  `fonts/*/Spectral-SemiBold.*` and its notice with this repository's `fonts/`.
- The manifest keys change: `family_identities.hplx` is `family_identity`,
  `entry_points.families.hplx` is `entry_points.family`, and
  `entry_points.historical_hplx_ember` is `entry_points.historical_ember`.
- Sync this repository with `vendor.mjs` (see the README) instead of copying files;
  baseline files then come from `vendor/brand-hplx/vendor/brand/`, at the release
  named in the manifest's `brand` section.
- `[data-family="hplx"]`, token names and generated values are unchanged.
