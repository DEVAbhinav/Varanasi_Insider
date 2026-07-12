# Sales-Weighted Keyword Action List — APPLIED
Generated 2026-07-12 from `data/gsc/2026-07-09/Queries.csv` (7-day snapshot, Jul 3–9 2026).

Mapping source: `scripts/keyword_page_map.py` → `data/gsc/2026-07-09/keyword-page-map.csv`
(bidirectional keyword↔page matcher indexing all 508 pages via `lib/posts.js` routing).

Scoring: buying-intent queries only (cab/taxi/fare/price/rent/package/ticket/dharamshala/stay).
Pure time/distance/aarti impression queries were **excluded** — they inflate impressions but
do not convert. Kashi Tamil Sangam page/keywords excluded per request.

Risk rule applied: **the higher a page's current clicks, the smaller the edit** (risk is lower
on low-performing pages). The top click-driver (`/bike-rentals-varanasi`) got a single
exact-phrase touch; low-traffic pages got fuller treatment.

**Status: all 10 applied and pushed (commit `94e77ab`, master, 2026-07-12).**

## Applied changes

| # | Query | Impr | Pos | CTR | Page (live URL) | Risk | Change applied |
|---|---|---|---|---|---|---|---|
| 1 | rathyatra mela 2026 | 1,392 | 4.0 | 0.8% | /en/jagannath-rath-yatra-varanasi-2026 | LOW | Added "Rath Yatra Mela" to metaTitle/metaDescription/H1, mela explainer + FAQ, fixed-fare taxi CTA. **Override:** auto-map pointed to magh-mela guide (weak 2/3 token); true owner is the Jagannath page. |
| 2 | taxi service in varanasi | 105 | 17.2 | 1% | /en/city/varanasi/taxi/taxi-service-varanasi | LOW | Led H1 with exact phrase on the hub; fixed `24-7-taxi-varanasi` anchor that pointed to `/` → now points to hub (consolidates signal). **Override:** auto-map title-matched the niche 24/7 page; generic term belongs to the hub. |
| 3 | vindhyachal dharamshala price per day (+ goenka dharamshala, near-mandir-with-price) | 21 / 13 / 9 | 7.6 | 4.8% | /en/services/where-to-stay-in-vindhyachal | LOW | Added "price per day" phrasing to price bands, Goenka line, keywords + price-per-day FAQ. **Override:** auto-map drifted to the itinerary page (weak all-terms); the stay page is the true owner. |
| 4 | varanasi to vindhyachal taxi fare | 53 | 12.8 | 1.9% | /en/city/vindhyachal/taxi/varanasi-to-vindhyachal-taxi | LOW | Added exact keyword + a fare-phrased FAQ (page already had fare H2/table). |
| 5 | varanasi local tour package | 18 | 12.6 | 5.6% | /en/city/varanasi/sightseeing/varanasi-local-sightseeing-package | LOW | Added exact "local tour package" phrase (page targeted "sightseeing package") + FAQ. |
| 6 | sarnath museum ticket price (+ sarnath ticket) | 37 / 32 | 5.1 | 2.7% | /en/sarnath-attractions-guide | LOW | Added ticket-price table + FAQ + `{{CTA:SARNATH_CAB:en}}` booking funnel (was info-only). |
| 7 | varanasi airport to kashi vishwanath temple uber price | 20 | 4.7 | 5% | /en/city/varanasi/taxi/varanasi-airport-to-kashi-vishwanath-distance | LOW | Added Uber-vs-fixed-fare comparison table + hub cross-link. |
| 8 | kashi vishwanath mandir ke pass dharamshala (काशी विश्वनाथ मंदिर के पास धर्मशाला) | 21 | 6.1 | 9.5% | /en/services/dharamshala-near-kashi-vishwanath-temple-varanasi | LOW | Added Hinglish + Devanagari keywords + bilingual FAQ (page was English-only phrasing). |
| 9 | tempo traveller 17 seater in varanasi price (+ ayodhya price list) | 6 / 7 | 3.0 | — | /en/17-seater-tempo-traveller-varanasi | LOW-MOD | Added exact "17 seater price" keyword phrasings. Ayodhya price-list page already fully optimized — no change. |
| 10 | bike on rent varanasi | 154 | 9.2 | 3.2% | /bike-rentals-varanasi (**PROTECTED top page**) | HIGH-CAUTION | Single exact-phrase touch inside one existing FAQ answer. No title/meta/structure change. |

## Notes for the next snapshot

- Re-run `python3 scripts/keyword_page_map.py map --queries data/gsc/<date>/Queries.csv --out data/gsc/<date>/keyword-page-map.csv` on each new GSC export.
- Auto-map is a starting point; the four **overrides** above (#1, #2, #3, and the niche-vs-hub call in #2) show where human intent-ownership beats token matching. Trust title/slug matches over body/all-terms matches.
- Measure lift in ~14 days: pull a fresh snapshot and compare position/CTR on the 10 queries above.
