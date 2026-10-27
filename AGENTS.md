# Working on the HPLX brand family

- Read `README.md` and the vendored foundation's
  `vendor/brand/guide/families.md` and `vendor/brand/guide/governance.md`. Inspect the
  working tree and preserve unrelated work. Keep the requested scope clear.
- Preserve approved marks, palettes, fonts and guidance unless the owner explicitly
  approves changing them. Do not turn an interface improvement into a new identity or
  a product, pricing or availability promise.
- This repository is the HPLX family only. Shared baseline values, controls, guidance
  and tools belong in `cosmiklabs/brand`; propose them there instead of adding a
  parallel copy here.
- Edit authoritative sources: `tokens/family.json` for token values, and the mark
  sources named in the README and the manifest (`assets/glimmer.source.json`). Never hand-edit generated tokens or SVGs.
- Retired identities and superseded guides belong in Git history, not archive folders.
- Never edit anything under `vendor/brand/`. Update it only with
  `node <brand checkout>/scripts/vendor.mjs sync --from <brand checkout> --into vendor/brand`
  from a clean checkout at a release tag, then rebuild. `vendor.mjs verify` fails on
  any change, addition or removal.
- Keep semantic roles and both themes intact; the vendored family check enforces the
  contract. Follow `vendor/brand/guide/interface.md` and `vendor/brand/guide/motion.md`.
- Avoid dependencies without a demonstrated need. Scripts use Node.js built-ins only.
  Keep builds deterministic, portable and usable offline.
- Run `npm run build` and `npm run check` after source changes, and
  `node scripts/build.mjs --check` from a clean commit. For visual changes, render
  and inspect the affected marks in both themes.
- Record verification honestly: distinguish written tests, executed checks and visual
  inspection. Do not claim accessibility certification.
- Keep values in `tokens/family.json`, canonical paths and status in
  `asset-manifest.json` and rules in the guides. Preserve font notices, provenance and
  approved originals.
- Review the final diff and generated changes. Do not add credentials, private
  screenshots, personal paths or test artifacts to tracked files.
- Commit, tag, publish or push only when authorized. Do not bump the family version
  or describe unreleased work as a published release without an actual release.
