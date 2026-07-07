---
name: createNewPage
description: "Use when the user asks to create/add a new page for the kashitaxi site from a block of provided detail text — new blog guide, service page, package, bus route, or destination/event/activity page. Parses the supplied brief, follows the repo's SEO + CTA + structure patterns strictly, places the markdown file in the correct content/ path, writes SEO-optimized frontmatter, reuses the shared CTA component, and validates the result."
---

# Create New Page

**Goal:** Take a block of **detailed text provided by the user** (the brief) and turn it into a complete, publish-ready page in this repo — correct file location, correct frontmatter, on-pattern content, reused CTA, and validated.

**Input:** freeform detailed text (topic, facts, prices, dates, FAQs, sections, etc.). Your job is to **parse it** and produce the page. Do not invent facts that aren't in the brief or the repo; if a required field is missing, ask once, then proceed with sensible defaults.

---

## STEP 0 — Read the pattern guides (STRICTLY follow them)

Before writing anything, read these files and follow them exactly. They are the quality bar; do not deviate:

- `docs/TOP-PAGE-SUCCESS-PATTERNS.md` — clicks/sales rules: title & meta formulas, H1/H2 structure, content flow, blocks, schema, CTA position, images. **Follow strictly.**
- `docs/SERVICE-PAGE-STRUCTURE.md` — required structure for service pages (hero, sticky CTA, fields).
- `docs/MODULAR-CTA-IMPLEMENTATION.md` — the CTA system; reuse it, never hand-build buttons.
- `lib/ctaBlocks.js` — registered CTA shortcodes (`{{CTA:NAME:lang}}`). Check available blocks before adding a new one.
- `lib/schemaGenerator.js` — which frontmatter fields trigger which schema (so you set the right ones).

If any guide is missing, stop and tell the user.

---

## STEP 1 — Parse the provided brief

From the user's text, extract and normalize:

| Field | How to derive |
|---|---|
| **Page type** | blog guide / service / package / bus route / destination event / activity / sightseeing / taxi / tour-package / travel-guide / food / shopping |
| **Primary topic + target keyword** | main phrase the page should rank/convert for |
| **slug** | lowercase, hyphens only, no spaces; include year (e.g. `-2026`) and product/route terms where relevant |
| **lang** | default `en` (dir `content/en`, `lang: en-IN`); `hi` only if the brief is Hindi |
| **Commercial signals** | price (₹), vehicle/seats, route, dates → drive title + schema |
| **FAQs** | pull Q&A pairs from the brief → `faqSchema` (aim ~6, real query phrasing, 40–70-word answers) |
| **Sections / H2s** | outline from the brief; write as buying-questions/steps per TOP-PAGE-SUCCESS-PATTERNS |
| **relatedPosts** | 6+ existing sibling slugs (search `content/<lang>/` to confirm they exist) |
| **featuredImage** | Cloudinary URL if given; else reuse an existing on-brand image from similar pages |

If page type or target keyword is unclear, ask **one** clarifying question, then continue.

---

## STEP 2 — Decide WHERE to create the file (routing)

URL is derived from the file path by `resolveRoutePathFromFilePath()` in `lib/posts.js`. Frontmatter `slug` overrides only the **last** URL segment. Place the file per this table (replace `en` with `hi` for Hindi):

| Page type | Create file at | Resulting URL |
|---|---|---|
| Blog / guide | `content/en/<slug>.md` | `/en/<slug>` |
| Service | `content/en/services/<slug>.md` | `/en/services/<slug>` |
| (also) landing / guides | `content/en/landing/<slug>.md` or `content/en/guides/<slug>.md` | `/en/services/<slug>` |
| Package | `content/en/packages/<slug>.md` | `/en/packages/<slug>` |
| Bus route | `content/en/bus/<slug>.md` | `/en/bus/<slug>` |
| Destination — event | `content/en/destinations/<destination>/events/<slug>.md` | `/en/city/<destination>/events/<slug>` |
| Destination — activity | `content/en/destinations/<destination>/activities/<slug>.md` | `/en/city/<destination>/activities/<slug>` |
| Destination — sightseeing | `content/en/destinations/<destination>/sightseeing/<slug>.md` | `/en/city/<destination>/sightseeing/<slug>` |
| Destination — taxi | `content/en/destinations/<destination>/taxi/<slug>.md` | `/en/city/<destination>/taxi/<slug>` |
| Destination — tour-packages | `content/en/destinations/<destination>/tour-packages/<slug>.md` | `/en/city/<destination>/tour-packages/<slug>` |
| Destination — travel-guide | `content/en/destinations/<destination>/travel-guide/<slug>.md` | `/en/city/<destination>/travel-guide/<slug>` |
| Destination — food / shopping | `content/en/destinations/<destination>/{food\|shopping}/<slug>.md` | `/en/city/<destination>/{food\|shopping}/<slug>` |

Rules:
- `<destination>` is the city folder (usually `varanasi`; other cities exist under `content/en/destinations/`). Valid categories: `activities, events, food, shopping, sightseeing, taxi, tour-packages, travel-guide`.
- Destination pages require **exactly** `destinations/<destination>/<category>/<slug>.md` (4 path parts) to route correctly.
- **First search** to confirm the slug doesn't already exist and to copy structure from the closest existing sibling:
  - `glob content/**/<slug>.md` and `grep` the target keyword under `content/`.
- Never place `.md` outside these folders; `index.md` files are ignored by the router.

---

## STEP 3 — Write frontmatter (match page type)

`lang` MUST match the directory. `slug` lowercase-hyphen. Use `faqSchema` (never `faq`). Keep `metaTitle` 55–75c and `metaDescription` 138–175c per TOP-PAGE-SUCCESS-PATTERNS (lead with ₹/year/specifics).

**Blog / guide:**
```yaml
---
title: "<natural query-form title>"
slug: "<slug>"
date: "<YYYY-MM-DD>"
lastUpdated: "<YYYY-MM-DD>"
author: "<author from repo, e.g. Kamal Nayan Singh>"
lang: en-IN
featuredImage: "<cloudinary url>"
metaTitle: "<Topic + Year + : + specifics>"
metaDescription: "<answer-first, ~150c>"
keywords: ["<kw>", "..."]
tags: ["<tag>", "..."]
relatedPosts: ["<sibling-slug>", "..."]
faqSchema:
  - question: "<real query>"
    answer: "<40-70 words, self-contained>"
---
```

**Service** (adds): `subtitle`, `phone: "9935474730"`, `schemaType: "Service"`, `serviceCategory`, `showRatesCheatSheet: false` if not transport. Follow `docs/SERVICE-PAGE-STRUCTURE.md`.

**Destination / event** (adds): `template: "destination"`, `eyebrow`, `ctaTitle`, `ctaSubtitle`, and for events `startDate`, `endDate` (both together), `location: {name, address}`, `organizer: {name, url}`, optional `offers: [{price, priceCurrency}]`. `template: destination` + `startDate` trigger Event schema.

Schema is auto-generated (`lib/schemaGenerator.js`): `faqSchema`→FAQPage, `offers`+`startDate`→Event, rating→Product(stars), else BlogPosting/Service + Breadcrumb + Organization. The JSON sidecar in a `json/` subfolder is **optional** (auto-fallback) — only create it for custom schema.

---

## STEP 4 — Write the body (follow TOP-PAGE-SUCCESS-PATTERNS strictly)

- One H1 in query form (add a price-bearing line for commercial pages).
- Above-the-fold **TL;DR / snapshot** answering the intent (+ price/fare snapshot for commercial).
- 5–14 keyword-front-loaded H2s written as buying-questions/steps; number them on price/how-to pages.
- Include **price/comparison tables** for data (not decorative images).
- End with FAQ section (mirrors `faqSchema`) → contextual internal links → CTA.
- Link info/event pages to money pages (rates/packages/where-to-stay).

---

## STEP 5 — CTA (reuse the shared component — never build buttons)

- **Markdown:** insert the shortcode `{{CTA:BLOCK:en}}` (or `:hi`) mid-body after value and near the end. Pick an existing block from `lib/ctaBlocks.js`; if none fits, register a new block there **once** (do not inline HTML/buttons).
- **JSX pages only:** use `components/CTA/CTASection.jsx` with its `variant` prop.
- Transport pages auto-inject `TaxiRatesCheatSheet` (its own CTA) — don't duplicate.

---

## STEP 6 — Companion steps

- **relatedPosts:** verify each referenced slug actually exists in `content/<lang>/`.
- **Hindi mirror:** only if the brief is bilingual/high-value — create the matching `content/hi/...` file.
- **Redirects:** if the slug carries a year and supersedes an older one (e.g. `-2025` → `-2026`), add a permanent redirect in the `redirects` array of `next.config.js`.
- **Sitemap:** no action — regenerated automatically by the `postbuild` hook.

---

## STEP 7 — Validate before done

- Confirm every `{{CTA:...}}` shortcode uses a block that exists in `lib/ctaBlocks.js`, and that the links/images you added resolve.
- Run `npm run build` — the real gate; it fails on bad routing, frontmatter, or schema. Fix any error before finishing.

Report to the user: created file path, resulting URL, schema types triggered, CTA block used, and any redirect/HI-mirror added.

---

## Guardrails / gotchas
- `lang` must match the directory (`content/en` ↔ `en`/`en-IN`; `content/hi` ↔ `hi`). Mismatch breaks routing.
- Destination pages need `template: "destination"` or Event/destination rendering won't apply.
- `startDate` requires `endDate`.
- Never set `canonical` to the page's own URL (redirect loop).
- Use only facts from the brief or existing repo content; don't fabricate prices/dates.
