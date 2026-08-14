# Top Sales Pages — Section Visuals Report

Date: 2026-08-14  
Site: Kashi Taxi (`kashitaxi.in`)

## Outcome

- Selected 50 high-commercial-intent pages from the supplied Search Console export.
- Selection prioritised paid taxi/transfer, rental, tour/package, group vehicle, assisted darshan, and pilgrimage-service intent before click volume. The export contained clicks and impressions, not revenue or conversion value.
- Created 100 original assets: exactly two per selected page.
- Each asset belongs to one named content section and uses facts extracted from that section. Whole-page or generic travel montages were excluded.
- Adopted the user-approved tactile editorial field-guide system: realistic service objects, watercolor/ink cartography, warm uncoated-paper texture, restrained palette, and a clear decision path.
- Added a deterministic footer to every final asset with `KASHI TAXI`, `kashitaxi.in`, the owning section, and `PLAN & BOOK THIS TRIP` so attribution survives downloads and republication.

## Delivery and integration

- Final format: WebP.
- Final dimensions: normally 1200 × 892 px.
- Local final files: `public/images/sales-visuals/final/`.
- Cloudinary folder: `kashitaxi/sales-visuals/`.
- Cloudinary delivery uses `f_auto,q_auto:good`.
- The Cloudinary URL, public ID, uploaded byte count, alt text, caption, credit, section, route, and local fallback are stored in `data/sales-visual-assets.json`.
- 96 assets were injected directly below their owning Markdown `##` section heading across 48 pages.
- The Bike Rental and Pink Taxi custom pages load their four assets from the same manifest through `SalesSectionVisuals`.
- Images link to the booking page, use descriptive alt text, carry visible attribution, and load lazily.

## Compression audit

- Assets checked: 100.
- Files at or above 250 KB: 0.
- Largest local/uploaded file: 248.3 KB.
- Compression is adaptive: WebP quality starts at 82 and steps down only when necessary.

## Completeness and quality checks

- `npx playwright test tests/sales-visuals.spec.ts --reporter=line`: 2/2 passed.
- Production build: passed; 616 static pages generated.
- Browser checks: English Markdown route, custom Bike Rental page, custom Pink Taxi page, and Hindi destination route each rendered exactly two visual assets.
- Mobile browser check confirmed the visual card scales to viewport width and retains a readable caption and embedded attribution footer.
- Visual QA used four 25-image contact sheets to inspect all 100 sources for style consistency, composition, subject relevance, and obvious mechanical or anatomical defects.

## Existing unrelated warnings observed

- Missing lowercase Avenir font URLs produce browser 404s; these predate this work.
- Next.js reports an existing `beforeInteractive` script warning in `pages/_app.js`.
- Several legacy pages exceed Next.js's 128 KB page-data warning threshold.
- Browserslist data is outdated.

These warnings did not block compilation or the sales-visual integration.

## Source of truth

- Page selection: `data/sales-visual-pages.json`
- Section prompts: `data/sales-visual-prompts.json`
- Final delivery manifest: `data/sales-visual-assets.json`
- Generation prompt builder: `scripts/build-sales-visual-prompts.mjs`
- Branding/compression pipeline: `scripts/finalize-sales-visuals.mjs`
- Cloudinary uploader: `scripts/upload-sales-visuals-cloudinary.mjs`
- Section injector: `scripts/inject-sales-visuals.mjs`
- Completeness audit: `tests/sales-visuals.spec.ts`
