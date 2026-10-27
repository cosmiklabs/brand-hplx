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

## 2026-10-26 — Reference-site consistency review

- Added searchable product Guide indexes, using the same Start here navigation position and chapter labels as Cosmik.
- Aligned the shared header identity slot and divider, and scaled product lockups proportionally to match the apparent size of the Cosmik header identity.
- Added original off-white and ink artwork previews to the Cosmik Overview, in paired dark/light surface cards.
- Built and checked all three repositories: 104 Cosmik, 31 HPLX and 36 Tectra tests passed.
- Inspected local desktop renders of all three overviews and the product index; checked all overviews at 1280, 390 and 320 px in light/dark themes: no horizontal overflow or broken images, 88 px desktop and 72 px mobile headers, matching desktop divider position. Product indexes also passed the same width/theme checks. Exercised HPLX index search and identity/index navigation.
- Approved identity sources, family tokens and vendored foundations were not changed. This is reference-site review evidence, not accessibility certification.

## 2026-10-26 — Shared presentation and artwork audit

This supersedes the earlier header sizing pass. Container dimensions alone did not establish consistent visible identities.

- Compared approved SVG canvases and visible bounds. Header symbols use their original assets in a 48 px slot, with Glimmer rendered at 36 px to compensate for its taller ink bounds. Visible symbol heights are approximately 30 px. All three names use the same Inter Medium 20 px / 26 px live interface label; full approved wordmarks remain in the artwork previews. No identity paths, fonts, token sources or vendored files changed.
- Consolidated headers, overview content structure, Guide indexes and identity surfaces into shared functions. Overview actions now open the Guide index on every site. Chapter headings follow navigation labels. Identity, Overview and Asset library pages use the same paired artwork/download cards.
- Preserved original SVG canvases and compensated for their different padding in CSS. Lockup ink/canvas width ratios are Cosmik 1336.64/2172, HPLX 178.892/192 and Tectra 178.03/195. Narrow previews use approved symbols across all three sites, with accurate captions.
- Executed local builds/checks: 104 Cosmik, 31 HPLX and 36 Tectra tests passed. Regressions cover live header labels, exclusion of undersized header lockups, common Guide index actions and both artwork surfaces on the three relevant page types.
- Executed the Chromium browser suite, including 64 reference page/theme/width cases. Separately checked 144 local browser combinations: 3 brands × 8 pages (Overview, Guide index, Identity, Assets, Tokens, Components, Typography, Color) × 3 widths (1440, 390, 320) × 2 themes. No horizontal overflow or unloaded images. All headers measured 88 px desktop / 72 px narrow; labels shared font, size, line height and x-position; desktop overview cards measured the same height.
- Inspected rendered overview, header, artwork and index comparisons, including the settled dark-theme artwork. An early capture omitted artwork during repaint; a settled capture and reload confirmed both original variants render. Screenshot timing is not counted as a site defect fixed by this change.
- Family palettes, heading faces, approved logo proportions and source-specific chapters remain distinct. These checks do not constitute accessibility certification.

## 2026-10-26 — Remove retired brand material

Removed the Historical navigation/page from the shared reference builder. Retired HPLX Ember assets, lockups, icons, builders and asset tests, plus Cosmik’s superseded guides and alternate artwork, are recoverable from Git history. Current approved assets, font notices, licence terms and pinned foundations remain unchanged. Manifest and navigation checks reject references to the retired page and HPLX distribution entries.

Executed builds and checks: 104 Cosmik, 24 current HPLX and 36 Tectra tests passed. HPLX’s seven retired-asset tests were removed with their assets; current Glimmer geometry, manifest, vendoring and navigation checks remain. Inspected the local HPLX Guide index and confirmed that neither navigation nor index contains an Archive/Historical section.
