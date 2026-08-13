# Sales Visuals Resume Checkpoint

Checkpoint created 2026-08-14 (Asia/Kolkata) because the Mac battery was low.

## Confirmed scope

- Select exactly 50 pages from the supplied Search Console export.
- Include only high-commercial-intent pages: paid taxi/transfer, rental, tour/package, group vehicle, assisted darshan, and pilgrimage services.
- Rank by commercial intent first, then export clicks. The export does not contain revenue or conversion value.
- Produce two useful, shareable visuals per page (100 total).
- Reject generic informational pages, even when traffic is higher.
- Visuals must look commissioned/editorial, avoid common generative artifacts, and contain useful route, vehicle-fit, pickup, access, or service-planning information.
- Apply deterministic Kashi Taxi branding after generation: `Kashi Taxi`, `kashitaxi.in`, and a restrained booking cue. Do not rely on generated lettering.
- Compress every delivered image below 250 KB, upload to Cloudinary, integrate into the matching page, audit, report, commit, and push.

## Saved work

- All completed source PNGs have been copied to `public/images/sales-visuals/source/`.
- The first two bike-rental assets and completed route/service assets are included there.
- A strict 50-page manifest still needs to be committed as machine-readable data and paired with filenames.
- Generation was restarted in batches of 10 after a 98-image parallel request hit a network timeout.

## Resume order

1. Finish any active image-generation batch and immediately copy outputs into `public/images/sales-visuals/source/`.
2. Generate remaining images in batches no larger than 10.
3. Visually audit sources; regenerate rejected assets.
4. Add deterministic branding and CTA footer, export WebP/JPEG below 250 KB.
5. Upload accepted finals to Cloudinary and save returned URLs/bytes in the manifest.
6. Add a shared sales-visual component and integrate two assets on each of the 50 routes.
7. Add tests for exact page count, two images per page, Cloudinary delivery, alt/caption/credit, and byte limits.
8. Run tests/build and a browser spot audit.
9. Write the final report, commit, and push.

