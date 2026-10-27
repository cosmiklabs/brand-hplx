# HPLX Glimmer

This repository is the HPLX family of the Cosmik brand: the HPLX tokens, the Glimmer
symbol and lockups, and Spectral for HPLX
headings. It builds on [`cosmiklabs/brand`](https://github.com/cosmiklabs/brand) v0.16.1,
vendored at `vendor/brand/` and pinned by `vendor/brand/brand.lock.json`. See
[Building on the Cosmik foundation](#building-on-the-cosmik-foundation).

Glimmer is the official HPLX symbol, selected and approved on 17 October 2026. A compact light above an enclosing shadow expresses the family’s light-and-dark motif. Use the exact approved paths in `assets/glimmer.source.json`; do not reshape, stretch, rotate or add effects.

## Canonical assets

- `assets/hplx-glimmer-dark.svg`: the approved amber variant on dark surfaces.
- `assets/hplx-glimmer-light.svg`: the approved umber variant on light surfaces.
- `assets/hplx-glimmer-black.svg`, `assets/hplx-glimmer-white.svg`: monochrome variants.
- `assets/hplx-glimmer-currentColor.svg`: inherits colour when inlined. External img elements do not inherit page text colour.
- `assets/hplx-glimmer-lockup-{dark,light,black,white,currentColor}.svg`: the approved horizontal pairing with HPLX outlined in Spectral SemiBold. Preserve the Spectral font notice in `fonts/licenses/Spectral-OFL.txt`.

The symbol has a 64×64 viewBox and visible bounds [8,6,48,54]. Keep at least 8 source units of clear space outside the visible mark. Recommended minimum symbol width is 24 CSS px; smaller exports require consumer-specific visual testing. Recommended lockup minimum width is 160 CSS px. Keep the exact approved geometry at every size; no optical redraw is implied.

If a linked logo alone identifies the destination, use an accessible name such as “HPLX”. If adjacent text already identifies it, hide the decorative symbol from assistive technology. Preserve transparent backgrounds and use a contrasting approved variant. Keep Cosmik’s endorsement separate.

## Product presentation

HPLX is an editor for *Amnesia: The Dark Descent* custom stories, with playtesting
built in. The current marketing headline is **Build your story. Step inside it.**
Follow it with the plain description so an unfamiliar visitor knows which game
and task it serves. **Build a story. Play it as you build.** is a supporting short
line for introductions and contexts that need to explain the editing/playtesting
workflow directly; it does not replace the product site's headline.

### Audience and value

Speak first to people making custom stories for the original *The Dark Descent*.
Show placing and changing a scene, playing from the editor, and returning to make
the next change. Specific workflow evidence is more useful than “easier and better”
on its own. The engine reimplementation supports this experience; Rust, Bevy and
repository structure are secondary technical context, not the opening pitch.

HPLX is one product. “Editor” and “built-in playtesting” describe its capabilities,
not competing brands. A public mention of another supported game requires current
product evidence; the HPLX name is not a promise of support for the whole HPL series.

### Availability and requirements

HPLX is in development, with no public release yet. Do not imply that a downloadable
release exists because its release workflow is implemented. Describe platform
support only at its verified scope, and distinguish tested configurations from
planned release targets. No release date is announced.

Cosmik does not require payment to use HPLX; this commitment is specific to HPLX.
The original game is obtained separately and may cost money. HPLX reads game content
from the person's own legitimately obtained local installation and does not include
or distribute the original game's assets. Keep this prerequisite close to download
or setup decisions and in a concise FAQ, rather than making it the whole opening.

HPLX is independent of and unaffiliated with Frictional Games. Preserve third-party
credits and notices. The implementation's licence, source visibility, available
builds and the brand artwork's terms are separate facts; do not infer any one from
another.

### Voice, imagery and next steps

Use direct, encouraging language about making a playable story. The warm palette,
Spectral headings and Glimmer give HPLX its character; interface labels stay plain
and familiar. Avoid writing in a horror character's voice, decorative lore, or
turning the original game's identity into HPLX's own mark.

Prefer an actual editing and playtesting sequence with a clear explanation of what
changed. Label a diagram as an illustration. Never present a simulated editor as
a screenshot, or a prepared scene as proof of gameplay compatibility. Keep original
game artwork in its credited product context.

HPLX leads its marketing, documentation and support surfaces. Use a quiet “By
Cosmik” in the footer or About context, separate from the product logo. In-development
pages should offer a real way to ask about HPLX or follow maintained updates;
“Download” appears only when a download is available. Do not promise beta access,
a response deadline or a newsletter that does not exist.

## Theme and generation

The approved HPLX palette and Spectral headings are unchanged. When HPLX content appears inside a Cosmik organisation surface, the enclosing organisation identity remains baseline; HPLX product interfaces use the family kit. This does not prescribe a navigation layout. Run `node scripts/build.mjs` to regenerate the canonical SVGs through `scripts/build-glimmer-assets.mjs`; `node scripts/check.mjs` tests the exact approved geometry, manifest and contrast roles.

## Current deliverables

Canonical manifest entry points select Glimmer. No platform icon package, optical redraw, splash, print proof or cross-browser conformance claim is included. Retired identities can be recovered from Git history.

Brand artwork remains covered by the [brand-use policy](LICENSE.md#2-brand-marks-trademark-style-policy). Approval does not imply trademark registration or third-party rights clearance.

HPLX does not imply official affiliation with a game's original owner or one licence across all code and assets.

## Interface use

Use the [consumer guide](https://github.com/cosmiklabs/brand/blob/v0.16.1/kits/README.md) for theme, font and scope integration.
HPLX heading roles may use Spectral; navigation, forms and utility text stay Inter.
Status tones supplement explicit words. Follow shared [interface](vendor/brand/guide/interface.md),
[motion](vendor/brand/guide/motion.md) and [quality review](vendor/brand/guide/quality.md) guidance
rather than inventing a separate animation or overlay system for the family.

### Approved editor density exception

The HPLX Editor's tool-panel density was approved separately: 28 px rows and
13 px text by default, with 24 or 32 px density options and no target below
24 × 24 px. This is specific to that application, not a shared control minimum
or a prescribed layout for other consumers.

## Building on the Cosmik foundation

This family extends the Cosmik baseline under the
[family contract](vendor/brand/guide/families.md). It never copies the contract,
generator or contrast pairs: `vendor/brand/` is an unmodified copy of the
`cosmiklabs/brand` release recorded in `vendor/brand/brand.lock.json` (repository,
tag, commit and the SHA-256 of every file), and the build and checks run those
vendored scripts.

| Path | Holds |
| --- | --- |
| `tokens/family.json` | The HPLX token source; `extends` names the vendored baseline |
| `tokens/hplx.{css,json,tokens.json}`, `tokens/hplx_tokens.rs` | Generated by `vendor/brand/scripts/family.mjs build .`; never edit |
| `assets/` | Glimmer sources and approved exports |
| `fonts/` | Spectral SemiBold (desktop TTF, web WOFF2) and its OFL notice |
| `vendor/brand/` | The Cosmik foundation: baseline tokens, controls, Inter and IBM Plex Mono, the guide and the family tools; never edit |
| `scripts/`, `tests/` | The HPLX builders, `build.mjs`, `check.mjs`, the manifest verifier and tests |
| `asset-manifest.json` | Every deliverable here with roles, status and SHA-256; `brand` names the foundation and `distribution` lists everything consumers sync, including `vendor/brand/` |

Requires Node.js 22 or later; there is nothing to install.

```sh
npm run build                # family build, HPLX builders, manifest hashes
npm run check                # vendor verify, family check, manifest, tests
node scripts/build.mjs --check   # rebuild from a clean commit; fail on any drift
```

### Updating the foundation

1. Check out `cosmiklabs/brand` at the new release tag, with a clean tree, and read
   its [changelog](https://github.com/cosmiklabs/brand/blob/v0.16.1/CHANGELOG.md).
2. `node <brand>/scripts/vendor.mjs sync --from <brand> --into vendor/brand`
   replaces `vendor/brand/` and its lock.
3. If the baseline token version changed, update `extends` in `tokens/family.json`.
4. `npm run build`, then `npm run check` and
   `node vendor/brand/scripts/vendor.mjs verify vendor/brand --release <brand>`.
5. Review the regenerated outputs (at least the provenance headers change) in both
   themes, then commit `vendor/brand/`, the outputs and the manifest together.

CI runs the checks on every push and pull request, and proves the lock against a
checkout of the tag it records.

### Consuming this repository

Products (an HPLX application, or a Cosmik surface showing HPLX) sync a release of
this repository with the brand vendor tool it carries. Check out a `vX.Y.Z` tag of
this repository, clean and exactly at the tag, then, in the consumer:

```sh
node <brand-hplx checkout>/vendor/brand/scripts/vendor.mjs sync --from <brand-hplx checkout> --into vendor/brand-hplx
node vendor/brand-hplx/vendor/brand/scripts/vendor.mjs verify vendor/brand-hplx
node vendor/brand-hplx/vendor/brand/scripts/vendor.mjs verify vendor/brand-hplx --release <brand-hplx checkout>
```

`sync` copies every file under `distribution` in `asset-manifest.json` after
checking its SHA-256 and writes `vendor/brand-hplx/brand-hplx.lock.json` (package,
repository, tag, commit and every file's hash). The set includes the Cosmik
foundation this family was built and checked against, unchanged under
`vendor/brand-hplx/vendor/brand/` with its own `brand.lock.json`, so one `verify`
checks both layers and names any changed, missing or extra file in either. Run it
in CI; `--release` also proves the lock against the tag. Do not sync
`cosmiklabs/brand` separately beside it.

Load the stylesheets in this order and scope HPLX surfaces with `data-family="hplx"`:

```html
<link rel="stylesheet" href="vendor/brand-hplx/vendor/brand/kits/cosmik/tokens/cosmik.css">
<link rel="stylesheet" href="vendor/brand-hplx/tokens/hplx.css">
<link rel="stylesheet" href="vendor/brand-hplx/vendor/brand/kits/cosmik/components/controls.css">
```

`controls.css` is optional. Spectral is under `vendor/brand-hplx/fonts/`, Inter and
IBM Plex Mono under `vendor/brand-hplx/vendor/brand/fonts/`, each with its notice.
`entry_points` in the manifest names each canonical file, and the identity sections
give each deliverable's role and status. New work uses Glimmer. Never edit the synced copies; take changes from a new release.

The terms for this repository's contents are in [LICENSE.md](LICENSE.md); the
foundation's are in [vendor/brand/LICENSE.md](vendor/brand/LICENSE.md). Release
history is in [CHANGELOG.md](CHANGELOG.md).

## HTML reference

The complete HTML reference includes this guide, live family typography and color,
approved downloads, a token browser and pinned shared rules. Run
`npm run dev:reference` for local preview. See
[reference setup and Pages publishing](reference/README.md); the presentation
tooling is shared with Cosmik while this family’s vendored foundation stays unchanged.
