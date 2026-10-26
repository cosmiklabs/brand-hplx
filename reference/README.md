# HPLX HTML reference

The generated `site/` is this family’s own brand reference. It renders the local family guide, license, changelog and relevant historical/validation notes, with shared rules read from the unchanged foundation pinned at `vendor/brand/`. Family typography, palette, current marks and fonts come from this repository, never the latest baseline checkout.

## Shared presentation tooling

The renderer, common layout, progressive enhancement and guide-site registry live in `cosmiklabs/brand`. This repository does not copy the family contract, token generator, baseline rules or contrast tests. `reference/tooling.lock.json` pins the exact presentation files by SHA-256. This is an explicitly unreleased presentation source snapshot, separate from the immutable released brand kit under `vendor/brand/`.

For development, keep the reviewed `brand` checkout beside this repository, put it in ignored `.reference-tooling/`, or set `REFERENCE_TOOLING_ROOT` to it. Once these source checkouts are available, builds work without a network or package install. The helper rejects missing or changed presentation files instead of silently taking newer code. Updating the reference tooling lock is a deliberate source review; it never updates the family’s pinned foundation.

```sh
npm run build
npm run dev:reference      # defaults to localhost:4188; PORT selects another port
npm run check
```

## GitHub Pages

The Pages workflow deploys only generated `site/`. Before the first deployment, publish the shared reference tooling in the `brand` repository, then set this repository’s **`BRAND_REFERENCE_REF` Actions variable to that exact 40-character commit SHA**. The workflow refuses a moving branch, checks out that immutable revision separately at `.reference-tooling/`, and the local content lock verifies its presentation files again. The normal check workflow uses the same dependency setup.

Select **Settings → Pages → GitHub Actions** as the Pages source. A push to `main` or a manual workflow run then builds, tests and deploys the reference. The expected project URL is `https://cosmiklabs.github.io/brand-hplx/`; this is not a claim that it is already deployed. The shared guide navigation points to all three separate project URLs.

No release tag, family version, product availability or platform icon approval is created by publishing a reference site. See [the validation record](validation.md) for executed checks and remaining limits.
