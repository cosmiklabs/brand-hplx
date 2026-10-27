# HPLX HTML reference

The generated `site/` is this family’s own brand reference. It renders the local family guide, license, changelog and relevant validation notes, with shared rules read from the unchanged foundation pinned at `vendor/brand/`. Family typography, palette, current marks and fonts come from this repository, never the latest baseline checkout.

## Shared presentation tooling

The renderer, common layout, progressive enhancement and guide-site registry live in `cosmiklabs/brand`. This repository does not copy the family contract, token generator, baseline rules or contrast tests. `reference/tooling.lock.json` pins the exact presentation files by SHA-256. This is an explicitly unreleased presentation source snapshot, separate from the immutable released brand kit under `vendor/brand/`.

For development, keep the reviewed `brand` checkout beside this repository, put it in ignored `.reference-tooling/`, or set `REFERENCE_TOOLING_ROOT` to it. Once these source checkouts are available, builds work without a network or package install. The helper rejects missing or changed presentation files instead of silently taking newer code. Updating the reference tooling lock is a deliberate source review; it never updates the family’s pinned foundation.

```sh
npm run build
npm run dev:reference      # defaults to localhost:4188; PORT selects another port
npm run check
```

## GitHub Pages

The Pages workflow deploys only generated `site/`. Both workflows pin the shared presentation tooling to commit `c2544514221fb019ec7e015e37cb7e2ba00c502f` in `cosmiklabs/brand`, checked out separately at `.reference-tooling/`. The local content lock verifies its presentation files again. Updating the tooling requires reviewing both the commit pin and file hashes; no Actions variable is needed.

Select **Settings → Pages → GitHub Actions** as the Pages source. A push to `main` or a manual workflow run then builds, tests and deploys the reference. The expected project URL is `https://cosmiklabs.github.io/brand-hplx/`; this is not a claim that it is already deployed. The shared guide navigation points to all three separate project URLs.

No release tag, family version, product availability or platform icon approval is created by publishing a reference site. See [the validation record](validation.md) for executed checks and remaining limits.


The current marketing review is committed locally. Before publishing these family
reference changes, publish their pinned shared-tooling commit in `cosmiklabs/brand`
first. This is a presentation-tooling update, not a change to the immutable
vendored foundation or a new family release.
