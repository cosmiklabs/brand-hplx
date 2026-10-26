# HPLX HTML reference validation

This is an unreleased reference-site change, not a new family release or identity approval. The family’s existing manifest and pinned foundation remain the authority. No token values, marks, font masters or vendored files are changed.

## Scope

The HTML guide renders this family’s Markdown and its own pinned shared guidance. Live typography, color modes, token values, asset downloads and neutral controls use this family’s resolved kit. Historical assets are not promoted as current downloads. The cross-site navigation links to the separate Cosmik, HPLX and Tectra references.

## Review

Reviewed on 2026-10-26. `npm run build` and `npm run check` pass (30 tests). Reference checks resolve every published local HTML/CSS link and fragment, verify family stylesheet ordering and all three guide links, check font notices and token counts, and reject changed presentation tooling. Existing kit checks verify the unchanged vendored release, family contracts, generated outputs and manifest hashes.

Live browser review covered 36 cases for this family: overview, typography, color, tokens, assets and components in light/dark modes at 1440, 390 and 320 CSS pixels. All had one main heading, no page overflow and no broken images; mobile navigation began collapsed. Search, empty token results, token filtering and form reset were exercised. Cross-navigation through Tectra → Cosmik → HPLX → Tectra worked in a preview bundle with local destinations. The browser reported no warnings or errors.

The production cross-links use the expected GitHub Pages URLs; remote deployment has not been verified. Local previews substitute relative links between the three generated sites. Browser review used the supported live browser; the separate root headless browser runner could not launch in this environment during the earlier root reference review. No additional assistive-technology, browser-engine, JavaScript-disabled or print review is claimed. No source changes are committed or published by this review.
