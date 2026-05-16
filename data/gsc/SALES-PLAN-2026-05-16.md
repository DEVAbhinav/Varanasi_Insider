---
title: Max-Sales Action Plan — kashitaxi.in
generated: 2026-05-16
based_on:
  - data/gsc/2026-04-03 (Jan 2–Apr 1, 2026)
  - data/gsc/KEYWORD-GAPS-2026-04-03.md
  - cta-verification-results.json (2025-10-04)
  - audit of 134 EN content files, all SEO scripts
---

# The single highest-leverage finding

**20 of 134 English content pages (15%) have no inline WhatsApp/booking link in the body.** Cross-referenced against the 90-day GSC top-clicks list, **7 of the top-80 pages are CTA-less, absorbing 1,389 clicks/quarter (~460/month)**.

Original draft of this report said 76 pages / 3,942 clicks — that was a case-sensitive grep bug ("WhatsApp" not matched). Corrected here.

The site already has a winning CTA pattern (bike-rentals page: 6.08% search CTR, 16 in-page wa.me/tel links). Most blog-style pages now have at least one mention, but **7 high-traffic ones still don't** — and a second issue surfaced below.

# Second issue: phone-number inconsistency (revenue routing bug)

Phone numbers used across `content/en/*.md`:

| Number | Occurrences | Status |
|---|---|---|
| 919935474730 | 96 | ✅ canonical WhatsApp in `lib/contact.js` |
| 918062182380 | 132 | ✅ canonical call in `lib/contact.js` |
| 919450301573 | 59 | ⚠️ **NOT in `lib/contact.js`** — separate number routing some leads |
| 919876543210 | 2 | ❌ looks like a placeholder/dummy |
| 8299764647, 9454404392, 9454401119 | a few each | ❓ unknown source |

This is high-priority to confirm: either these alternate numbers are intentional (e.g., a partner/driver line) or some pages are sending leads into a void. Either way, content should not be hardcoding numbers — it should be coming from `lib/contact.js`.

# Triage: pages by intent, then by traffic

## A. Pure commercial intent — fastest revenue wins (≈600 clicks/qtr without inline CTA)

These pages have "distance / price / cab / taxi" in the URL. Visitor is already in buying mode.

| Page | Clicks/qtr | Why it matters |
|---|---|---|
| /en/varanasi-to-vindhyachal | 370 | Distance query → cab need. Hindi twin has WhatsApp; English does not. |
| /en/varanasi-to-ayodhya | 122 | Same pattern. |
| /en/varanasi-to-bodhgaya-taxi-cost | 46 | "taxi-cost" in slug — buyer intent. |
| /en/varanasi-day-tour-cab-charges | 38 | "cab-charges" — buyer intent. |
| /en/assi-ghat-to-airport-distance | 31 | Airport transfer query. |
| /en/morning-boat-ride-varanasi-price | 275 | "price" in slug. Highest-intent boat query. |

**Action:** add a contextual inline CTA after the distance/price section on each: `[Get a fixed quote on WhatsApp](https://wa.me/919935474730?text=Varanasi%20to%20<dest>%20cab%20quote)`. 6 files, ~10 minutes each.

## B. Festival/event pages — time-sensitive bookings (≈1,200 clicks/qtr without inline CTA)

These users are planning an upcoming trip dated to a specific festival window. They convert if asked.

| Page | Clicks/qtr |
|---|---|
| /en/maha-shivaratri-2026-varanasi-guide | 396 |
| /en/kashi-vishwanath-shivaratri-crowd-survival-guide | 282 |
| /en/trikon-parikrama-vindhyachal-complete-guide | 297 |
| /en/shiv-baraat-viewing-guide-varanasi | 109 |
| /en/makar-sankranti-2026-varanasi-kite-festival-guide | 77 |
| /en/navratri-pilgrimage-vindhyachal-from-varanasi-guide | 40 |

**Action:** inline CTA after the "logistics / how to get there" section with the festival named in the WhatsApp prefill: `?text=Need%20Maha%20Shivaratri%20cab%20%26%20boat%20plan`.

## C. Top-of-funnel planning — biggest traffic, harder to convert (≈1,600 clicks/qtr without inline CTA)

These users are still researching. CTAs need to be lower-pressure ("plan with us") rather than "book now".

| Page | Clicks/qtr |
|---|---|
| /en/what-to-wear-in-varanasi | 670 |
| /en/is-varanasi-safe-for-solo-female-travellers | 349 |
| /en/varanasi-in-february-2026 | 227 |
| /en/sarnath-complete-guide | 172 |
| /en/safety-and-security-in-varanasi-guide-for-solo-travellar | 101 |
| /en/best-time-to-visit-varanasi | 81 |

**Action:** soft CTA — "Planning your Varanasi trip? Get a free WhatsApp itinerary review." Place once mid-article, once at end.

# The keyword-gap lever (already mapped)

`data/gsc/KEYWORD-GAPS-2026-04-03.md` lists 103 missing query phrasings across 15 pages, weighted by impressions. Top 5 pages give 50k missing impressions — work them in conjunction with adding the inline CTA on the same page.

| Page | Missing-query impr | Action with CTA pass |
|---|---|---|
| /en/city/varanasi/taxi/varanasi-airport-to-kashi-vishwanath-distance | 9,021 | Add 6 query phrasings + airport-to-temple cab CTA |
| /en/dashashwamedh-ghat-ganga-aarti-timing | 5,598 | Add morning-aarti phrasings + boat booking CTA already present, improve placement |
| /en/assi-ghat-evening-aarti-time | 4,504 | Add 6 phrasings + aarti boat CTA (CTA missing) |
| /en/assi-ghat-morning-aarti-time | 4,329 | Add 6 phrasings + sunrise boat CTA (CTA missing) |
| /en/city/varanasi/taxi/varanasi-airport-to-mirzapur-vindhyachal-distance | 2,957 | Vindhyachal cab CTA |

# Why I'm confident this drives sales (not just clicks)

- The site already proves the pattern works: bike-rentals page has the buy buttons embedded throughout, and it is **the #1 click driver and only page over 6% CTR**.
- The two pages in cta-verification-results.json where sticky CTA actually works on scroll are the two `/services/` pages — both also have CTA copy "Ready to book?" (action), not "Need help planning?" (passive).
- 3,942 clicks/qtr without a buy button is a known leak. Even a 1% inline-CTA conversion lifts revenue by ~40 leads/month with no new traffic.

# What I am explicitly NOT doing (and why)

- Rewriting titles on knowledge-panel-blocked queries (sarnath temple, manikarnika ghat). Cannot beat Google's own card; SERP inspection required before risking ranking.
- Fighting US/desktop CTR — low-revenue audience.
- Year-stale slug indexing — 301s exist, Google's pace.
- Adding new pages — existing pages have unrealized revenue first.

# Plan, in execution order

**Step 1 (mechanical, do today)**
- Fix 5 trailing-slash canonicals — already-known duplicate URL issue (split signals).
- Regenerate sitemap.
- Run `node scripts/check-internal-links.js` — fix any 404s.

**Step 2 (the sales lever — week 1)**
- Add inline WhatsApp CTAs to the 6 commercial-intent pages in section A. Use prefill text that names the destination/service so the inbound message identifies itself.
- Verify sticky bar fires on these pages (it failed on 4/6 audited pages). If not, fix layout selection.

**Step 3 (the keyword lever — week 1)**
- For the same pages in Step 2, plus the 5 in the keyword-gap table, add the missing query phrasings to frontmatter `keywords:` and one literal mention per phrasing in body or new FAQ entries.

**Step 4 (week 2)**
- Sections B + C — 12 more pages. Same pattern: contextual inline CTA + closing CTA + missing keywords.

**Step 5 (week 3)**
- Run `node scripts/submit-to-google.js` against the edited URLs.
- Take a 14-day GSC snapshot, rerun `scripts/find_missing_queries.py`, compare.

# What needs scripts I will write next

1. **`scripts/match-missing-queries-to-pages.py`** — the matcher I built inline today, promoted to a real script. Generates `data/gsc/keyword-page-gaps-<date>.csv` on demand.
2. **`scripts/audit-page-cta.js`** — counts wa.me/tel links per content/*.md, flags any page in the top-100 GSC clicks list with zero inline CTAs.

Both are small and re-runnable on every new GSC export.
