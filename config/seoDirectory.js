/**
 * config/seoDirectory.js — CURATED OVERLAY for the automated internal-link system.
 *
 * This file is the ONLY hand-maintained input. Everything else (page discovery,
 * GSC click/impression/position join, intent classification, anchor generation,
 * priority scoring) is produced automatically at build time by
 * `scripts/generate-link-graph.js`, exactly like the sitemap.
 *
 * Decisions encoded here are evidence-based (see files/seo-footer-plan.md §H,
 * derived from data/gsc keyword-page-map.csv exports):
 *   - `/bike-rentals-varanasi` is the #1 sales earner → top billing.
 *   - Traffic is mostly informational → guide pages funnel to money pages.
 *   - Pin ONE canonical owner per broad intent; siblings surface via backfill.
 *
 * Pin `path` values are the EN canonical path. For the Hindi footer the generator
 * swaps `/en/` → `/hi/` and includes a pin only if that Hindi page actually
 * exists (never cross-links languages). Language-neutral root pages (no `/en/`
 * prefix, e.g. `/bike-rentals-varanasi`) are treated as English-only.
 */

// One dofollow link to the parent company (Bharat Tourism). Replaces the old
// 9-link sitewide external block that diluted equity across 500+ pages.
const PARENT_COMPANY_LINK = {
  href: 'https://bharat-tourism.com/',
  label: 'Part of the Bharat Tourism family',
  external: true,
  rel: 'dofollow',
};

/**
 * Footer groups, money-first (data-ordered). Each group:
 *   - id, title
 *   - pins:   ordered curated links {path, label}. Rendered first, in order.
 *   - fill:   { category?, productType?, destination?, max } — the generator
 *             backfills the group with in-language pages matching these facets,
 *             ranked by GSC clicks desc, up to `max` total links in the group
 *             (pins + fill). Omit `fill` for a fixed, pins-only group.
 */
const FOOTER_GROUPS = [
  {
    id: 'bike-scooty',
    title: 'Bike & Scooty Rental',
    pins: [
      { path: '/bike-rentals-varanasi', label: 'Scooty & Bike Rental in Varanasi' },
    ],
    // Proven #1 money page; small, focused group.
  },
  {
    id: 'taxi-services',
    title: 'Taxi Services in Varanasi',
    pins: [
      { path: '/en/city/varanasi/taxi/24-7-taxi-varanasi', label: 'Taxi Service in Varanasi (24×7)' },
      { path: '/en/varanasi-airport-taxi-guide', label: 'Varanasi Airport Taxi (from ₹899)' },
      { path: '/pink-taxi-varanasi', label: 'Pink Taxi Varanasi' },
    ],
    fill: { category: 'taxi', max: 8 },
  },
  {
    id: 'boat-aarti',
    title: 'Boat Rides & Ganga Aarti',
    pins: [
      { path: '/en/packages/varanasi-boat-ride-booking', label: 'Private Boat Ride Booking' },
      { path: '/en/morning-boat-ride-varanasi-price', label: 'Morning Boat Ride Price' },
      { path: '/en/city/varanasi/activities/84-ghats-boat-tour-varanasi', label: '84 Ghats Boat Tour' },
      { path: '/en/city/varanasi/activities/ganga-aarti-timing-varanasi-2026', label: 'Ganga Aarti Timings' },
    ],
    fill: { category: 'activities', max: 8 },
  },
  {
    id: 'tour-packages',
    title: 'Varanasi Tour Packages',
    pins: [
      { path: '/en/packages/varanasi-tour-package', label: 'Varanasi Tour Package (2N/3D)' },
      { path: '/en/varanasi-tour-package-for-families', label: 'Family Tour Package' },
      { path: '/en/varanasi-tour-package-with-hotel', label: 'Tour Package with Hotel' },
      { path: '/en/senior-citizen-varanasi-tour-package', label: 'Senior Citizen Package' },
      { path: '/banaras-tour-package', label: 'Banaras Tour Package' },
    ],
    fill: { category: 'tour-packages', max: 9 },
  },
  {
    id: 'outstation',
    title: 'Outstation & Pilgrimage Taxi',
    pins: [
      { path: '/en/city/varanasi/taxi/varanasi-to-sarnath-taxi', label: 'Varanasi to Sarnath Taxi' },
      { path: '/en/varanasi-to-vindhyachal-taxi', label: 'Varanasi to Vindhyachal Taxi' },
      { path: '/en/city/varanasi/taxi/varanasi-to-gaya-taxi-service', label: 'Varanasi to Gaya Taxi' },
      { path: '/en/city/nepal/taxi/varanasi-to-nepal-taxi', label: 'Varanasi to Nepal Taxi' },
    ],
    fill: { productType: 'route_taxi', max: 9 },
  },
  {
    id: 'tempo-group',
    title: 'Tempo Traveller & Group Travel',
    pins: [
      { path: '/en/17-seater-tempo-traveller-varanasi', label: '17-Seater Tempo Traveller' },
      { path: '/en/varanasi-to-ayodhya-tempo-traveller', label: 'Varanasi to Ayodhya Tempo' },
      { path: '/en/force-urbania-hire-varanasi', label: 'Force Urbania Hire' },
      { path: '/en/varanasi-group-tour-package', label: 'Group Tour Package' },
    ],
    fill: { productType: 'vehicle', max: 8 },
  },
  {
    id: 'guides',
    title: 'Varanasi Travel Guides & Timings',
    pins: [
      { path: '/en/assi-ghat-aarti-timings-2026', label: 'Assi Ghat Aarti Timings' },
      { path: '/en/sarnath-timing-visit-guide', label: 'Sarnath Timings & Visit Guide' },
      { path: '/en/varanasi-in-monsoon-july-september-2026', label: 'Varanasi in Monsoon' },
      { path: '/en/city/varanasi/events/kashi-tamil-sangamam-2026-varanasi', label: 'Kashi Tamil Sangamam 2026' },
    ],
    fill: { category: 'guide', max: 9 },
  },
  {
    id: 'company',
    title: 'Company',
    pins: [
      { path: '/en/about', label: 'About Us' },
      { path: '/en/contact', label: 'Contact' },
      { path: '/en/privacy-policy', label: 'Privacy Policy' },
    ],
    extraLinks: [PARENT_COMPANY_LINK],
    // pins-only + one external parent link; no GSC backfill.
  },
];

/**
 * Cross-sell rules for the per-page RelatedLinks block (§H.2): capture the large
 * informational traffic and funnel it to the nearest sellable page. Keyed by the
 * source page's classified `category`; value = ordered list of target money-page
 * paths. The generator resolves these against discovered pages (skips missing)
 * and localizes per language.
 */
const CROSS_SELL_BY_CATEGORY = {
  activities: [
    '/en/packages/varanasi-boat-ride-booking',
    '/en/morning-boat-ride-varanasi-price',
    '/en/services/varanasi-full-day-city-tour-winter-2026',
  ],
  sightseeing: [
    '/en/packages/varanasi-tour-package',
    '/en/services/varanasi-full-day-city-tour-winter-2026',
    '/en/packages/varanasi-boat-ride-booking',
  ],
  events: [
    '/en/packages/varanasi-tour-package',
    '/en/city/varanasi/taxi/24-7-taxi-varanasi',
    '/en/varanasi-airport-taxi-guide',
  ],
  guide: [
    '/en/city/varanasi/taxi/24-7-taxi-varanasi',
    '/en/packages/varanasi-tour-package',
    '/en/varanasi-airport-taxi-guide',
  ],
  'tour-packages': [
    '/en/packages/varanasi-tour-package',
    '/en/packages/varanasi-boat-ride-booking',
    '/en/city/varanasi/taxi/24-7-taxi-varanasi',
  ],
  taxi: [
    '/en/packages/varanasi-tour-package',
    '/en/17-seater-tempo-traveller-varanasi',
    '/en/packages/varanasi-boat-ride-booking',
  ],
};

// Paths to exclude from all automated backfill/related output (never surface).
const EXCLUDE_PATHS = [
  '/en/privacy-policy',
  '/hi/privacy-policy',
  '/en/terms-and-conditions',
  '/booking',
];

// Substrings; any discovered path containing one is excluded from backfill.
const EXCLUDE_PATTERNS = ['/privacy', '/terms', '/refund', '/disclaimer'];

module.exports = {
  PARENT_COMPANY_LINK,
  FOOTER_GROUPS,
  CROSS_SELL_BY_CATEGORY,
  EXCLUDE_PATHS,
  EXCLUDE_PATTERNS,
};
