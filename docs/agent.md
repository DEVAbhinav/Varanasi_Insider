# Agent Playbook: SEO-First Page Creation

_Last updated: November 21, 2025_

This playbook consolidates the non-negotiable SEO standards for new or updated pages on **kashitaxi.in**. Treat it like a checklist every time you brief, draft, or ship a page.

---

## 1. Planning & Briefing

1. **Target intent first.** Define the primary keyword, supporting variants, and the traveler intent (taxi, package, sightseeing, etc.).
2. **Select the correct template.**
   - Markdown location determines route:
     - `/content/{lang}/destinations/{city}/{category}/{slug}.md` → `/[lang]/city/{city}/{category}/{slug}`
     - `/content/{lang}/services|landing|guides/{slug}.md` → `/[lang]/services/{slug}`
     - `/content/{lang}/packages/{slug}.md` → `/[lang]/packages/{slug}`
   - Pick the folder that matches how the page should rank (service vs. guide vs. destination).
3. **Gather structured assets.** Hero image, fare tables, itinerary data, FAQ pairs, CTA copy, and contact numbers must be prepared before writing.

---

## 2. Frontmatter Essentials

Each Markdown file needs accurate frontmatter to feed metadata and JSON-LD.

| Field | Purpose | Tips |
| --- | --- | --- |
| `title`, `description`, `metaTitle`, `metaDescription` | Page + OG/Twitter tags | Include keyword + benefit. Keep metaDescription ≤ 160 chars.
| `slug`, `lang`, `date`, `lastUpdated` | Routing + sitemap freshness | Slug must stay lowercase-hyphenated; update `lastUpdated` whenever you edit copy.
| `keywords`, `tags` | Long-tail discoverability | Use 4–8 specific terms; no stuffing.
| `template` | Should be `destination`, `service`, etc. | Drives layout-specific widgets.
| `relatedPosts` | Internal linking | List slugs for contextual links.
| `faqSchema` | Optional but recommended | 2–4 Q&A pairs in plain text.

---

## 3. Body Content Checkpoints

1. **Above the fold:** H1 repeats target query, first paragraph states the core promise.
2. **Data blocks:** Distance/time/fare tables for taxi routes; itinerary timelines for packages; bullet checklists for guides.
3. **CTA consistency:** Use dispatch phone `9450301573` and WhatsApp deep links. Include at least one CTA before the fold and one at the end.
4. **Internal links:** Link to relevant guides, booking pages, and glossary terms. Minimum 3 contextual links per 750 words.
5. **Language parity:** If you add a Hindi version, mirror the sections and update `lang` + `relatedPosts` for cross-linking.

---

## 4. Structured Data Workflow

1. **Destination & taxi pages:**
   - Store TaxiService/Product schema in `/content/{lang}/destinations/{city}/{category}/json/{slug}.json`.
   - Include `AggregateOffer` price bands, `areaServed`, `timeRequired`, and `knowsAbout` landmarks.
2. **Services/packages:**
   - Use `lib/posts.getJsonLdData` templates or place JSON in `/content/{lang}/json/{slug}.json`.
3. **Validation:** After editing, run the page through Google’s Rich Results Tester using the preview URL to confirm the schema renders in `<head>` and references canonical URLs.

---

## 5. Hreflang & Internationalization

1. **Always set `lang` correctly** (`en`, `hi`).
2. **Alternate URLs** are generated automatically via `buildAlternateLanguageUrls()`; ensure the translated file exists with the same relative path for true hreflang coverage.
3. **Canonical integrity:** Never hardcode cross-language canonicals; the head components compute them using `pageLang` + `pageSlug`.

---

## 6. Assets & Images

1. **Use local assets** under `/public/images`. If you reference an external URL, ensure it’s optimized and accessible.
2. **Thumbnail selection:** Add `featuredImage` in frontmatter; otherwise the system attempts to auto-match.
3. **Compression:** Keep hero images under 200KB when possible; run them through an optimizer before committing.

---

## 7. Publishing Checklist

1. `npm run lint` — must return clean.
2. `npm run build` (if touching runtime logic or templates) — verify there are no blocking errors.
3. `node scripts/generate-sitemap.js` — rerun if you add/delete a page; commit the updated `public/kt-secret-map-v9.xml`.
4. **Self-QA:**
   - Load `/[lang]/...` locally, inspect `<head>` for title/meta/JSON-LD.
   - Check CTAs, internal links, and booking widgets.
5. **Commit message:** Summarize intent, e.g., “Add Ghazipur taxi route + schema”.

---

## 8. FAQ for Agents

- **Q: How do I add a new taxi route?**
  1. Duplicate a proven taxi markdown file, update location-specific data, and save under the correct destination folder.
  2. Create the JSON schema file with refreshed distances/fare offers.
  3. Update internal links (airport guide, fare calculator, etc.).

- **Q: When should I create a Hindi version?**
  - For any route or guide targeting domestic pilgrims. Copy the English structure, translate the body, adapt CTAs, and save under `/content/hi/...` with matching JSON.

- **Q: What if I rename a slug?**
  - Avoid it unless necessary. If you must, update the markdown filename, JSON file, sitemap, and add a redirect in `next.config.js` from the old path to the new one.

---

Keep this file updated whenever we refine SEO rules or tooling. If a guideline is unclear, document the answer here after you resolve it so the next agent moves faster.
