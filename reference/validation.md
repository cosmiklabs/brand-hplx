# HPLX HTML reference validation

This is an unreleased reference-site change, not a new family release or identity approval. The family’s existing manifest and pinned foundation remain the authority. No token values, marks, font masters or vendored files are changed.

## Scope

The HTML guide renders this family’s Markdown and its own pinned shared guidance. Live typography, color modes, token values, asset downloads and neutral controls use this family’s resolved kit. Historical assets are not promoted as current downloads. The cross-site navigation links to the separate Cosmik, HPLX and Tectra references.

## Review

Reviewed on 2026-10-26. `npm run build` and `npm run check` pass (30 tests). Reference checks resolve every published local HTML/CSS link and fragment, verify family stylesheet ordering and all three guide links, check font notices and token counts, and reject changed presentation tooling. Existing kit checks verify the unchanged vendored release, family contracts, generated outputs and manifest hashes.

Live browser review covered 36 cases for this family: overview, typography, color, tokens, assets and components in light/dark modes at 1440, 390 and 320 CSS pixels. All had one main heading, no page overflow and no broken images; mobile navigation began collapsed. Search, empty token results, token filtering and form reset were exercised. Cross-navigation through Tectra → Cosmik → HPLX → Tectra worked in a preview bundle with local destinations. The browser reported no warnings or errors.

The production cross-links use the expected GitHub Pages URLs; remote deployment has not been verified. Local previews substitute relative links between the three generated sites. Browser review used the supported live browser; the separate root headless browser runner could not launch in this environment during the earlier root reference review. No additional assistive-technology, browser-engine, JavaScript-disabled or print review is claimed. No source changes are committed or published by this review.


## Reference header alignment — 2026-10-26

The shared reference header now has an 88 px minimum desktop height and a 72 px minimum mobile height. Logos retain their proportions and remain vertically centered. At widths of 380 px and below, the visible Theme label is hidden while the select retains its accessible name, keeping the header on one row. Live local browser measurements confirmed identical heights across Cosmik, HPLX and Tectra at 1280, 390 and 320 px with no horizontal overflow. All 164 repository tests passed before the final narrow-screen label adjustment; that adjustment was checked in the live browser.


## Reference navigation consistency — 2026-10-26

Shared presentation now defines sidebar labels and section ordering, search prompts, homepage actions and component examples. Brand-specific chapters and assets remain separate. Cosmik’s component page retains the guide navigation and links to its full interactive specimen with a return link. A selected theme is stored locally and reused across guide pages on the same host. Storage failures fall back to page-local selection.

Local review covered 54 page/theme/viewport combinations across the three guides at 1280, 390 and 320 px, with no overflow, broken images or missing active navigation. Form reset, search, mobile navigation and the interactive-specimen return path were exercised. Theme selection persisted between sites. Local repository checks passed 100 Cosmik, 31 HPLX and 36 Tectra tests. CI runs the full browser suite, including 64 reference layout cases and theme retention.
