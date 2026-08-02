import { test, expect } from '@playwright/test';

// ─── URL Inventory (55 URLs) ───────────────────────────────────────────────────
// Mix of: homepage, key English pages, Hindi pages, 2026-specific pages,
// service pages, rate pages, bike rentals, booking, and redirect targets.

const CRITICAL_PAGES = [
  // Core pages
  { url: '/', name: 'Homepage' },
  { url: '/en/', name: 'English Home' },
  { url: '/hi/', name: 'Hindi Home' },
  { url: '/booking', name: 'Booking' },
  { url: '/bike-rentals-varanasi', name: 'Bike Rentals' },
  { url: '/rates/outstation-taxi-varanasi', name: 'Outstation Rates' },

  // English – 2026-specific slugs
  { url: '/en/dev-deepawali-2026-varanasi-ultimate-guide', name: 'Dev Deepawali 2026' },
  { url: '/en/dev-deepawali-boat-ride-pricing-guide-2026', name: 'Dev Deepawali Boat 2026' },
  { url: '/en/dev-deepawali-photography-guide-2026', name: 'Dev Deepawali Photo 2026' },
  { url: '/en/ganga-mahotsav-2026-classical-festival-varanasi', name: 'Ganga Mahotsav 2026' },
  { url: '/en/nag-nathaiya-festival-varanasi-2026', name: 'Nag Nathaiya 2026' },
  { url: '/en/maha-shivaratri-2026-varanasi-guide', name: 'Maha Shivaratri 2026' },
  { url: '/en/makar-sankranti-2026-varanasi-kite-festival-guide', name: 'Makar Sankranti 2026' },
  { url: '/en/varanasi-in-december-2026', name: 'Varanasi Dec 2026' },
  { url: '/en/varanasi-in-february-2026', name: 'Varanasi Feb 2026' },
  { url: '/en/varanasi-in-november-2026-insider-guide', name: 'Varanasi Nov 2026' },
  { url: '/en/varanasi-in-october-2026', name: 'Varanasi Oct 2026' },
  { url: '/en/varanasi-in-monsoon-july-september-2026', name: 'Varanasi Monsoon 2026' },
  { url: '/en/varanasi-transport-price-guide-2026', name: 'Transport Price Guide 2026' },
  { url: '/en/assi-ghat-aarti-timings-2026', name: 'Assi Ghat Aarti 2026' },
  { url: '/en/varanasi-kite-wars-tourist-guide-makar-sankranti-2026', name: 'Kite Wars 2026' },
  { url: '/en/ultimate-guide-ramlila-dussehra-varanasi-2026', name: 'Ramlila Dussehra 2026' },

  // English – evergreen / popular pages
  { url: '/en/about', name: 'About' },
  { url: '/en/contact', name: 'Contact' },
  { url: '/en/services', name: 'Services' },
  { url: '/en/packages/varanasi-tour-package', name: 'Varanasi Tour Package' },
  { url: '/en/sarnath-complete-guide', name: 'Sarnath Guide' },
  { url: '/en/tempo-traveller-varanasi', name: 'Tempo Traveller' },
  { url: '/en/varanasi-travel-agent', name: 'Travel Agent' },
  { url: '/en/dashashwamedh-ghat-ganga-aarti-timing', name: 'Dashashwamedh Aarti' },
  { url: '/en/tourist-spots-varanasi', name: 'Tourist Spots' },
  { url: '/en/varanasi-airport-taxi-guide', name: 'Airport Taxi Guide' },
  { url: '/en/guide-to-ghats-of-varanasi', name: 'Ghats Guide' },
  { url: '/en/best-time-to-visit-varanasi', name: 'Best Time to Visit' },
  { url: '/en/varanasi-to-ayodhya-taxi', name: 'Varanasi to Ayodhya' },
  { url: '/en/outstation-cabs-from-varanasi', name: 'Outstation Cabs' },
  { url: '/en/services/varanasi-full-day-city-tour-winter-2026', name: 'City Tour Winter 2026' },
  // Airport Taxi Winter 2026 service page does not exist (old page was redirected to /en/varanasi-airport-taxi-price-guide)

  // Hindi – 2026-specific
  { url: '/hi/dev-deepawali-2026-varanasi-ultimate-guide', name: 'HI Dev Deepawali 2026' },
  { url: '/hi/ganga-mahotsav-2026-classical-festival-varanasi', name: 'HI Ganga Mahotsav 2026' },
  { url: '/hi/assi-ghat-aarti-timings-2026', name: 'HI Assi Ghat 2026' },
  { url: '/hi/varanasi-in-december-2026', name: 'HI Varanasi Dec 2026' },
  { url: '/hi/varanasi-in-october-2026', name: 'HI Varanasi Oct 2026' },
  { url: '/hi/varanasi-transport-price-guide-2026', name: 'HI Transport Price 2026' },

  // Hindi – evergreen
  { url: '/hi/about', name: 'HI About' },
  { url: '/hi/tempo-traveller-varanasi', name: 'HI Tempo Traveller' },
  { url: '/hi/varanasi-to-ayodhya-taxi', name: 'HI Varanasi to Ayodhya' },
  { url: '/hi/varanasi-airport-taxi-guide', name: 'HI Airport Taxi Guide' },
  { url: '/hi/outstation-cabs-from-varanasi', name: 'HI Outstation Cabs' },
  { url: '/hi/morning-boat-ride-varanasi-price', name: 'HI Morning Boat Ride' },
  { url: '/hi/services/varanasi-safest-taxi-for-women', name: 'HI Pink Taxi' },

  // Landing / special
  { url: '/en/landing/dev-deepawali-taxi-booking-varanasi', name: 'Dev Deepawali Landing' },
  { url: '/en/packages/varanasi-tour-package', name: 'Tour Package' },
];

// Pages with images worth spot-checking
const IMAGE_CHECK_PAGES = [
  { url: '/', name: 'Homepage' },
  { url: '/en/dev-deepawali-2026-varanasi-ultimate-guide', name: 'Dev Deepawali 2026' },
  { url: '/en/sarnath-complete-guide', name: 'Sarnath Guide' },
  { url: '/en/tourist-spots-varanasi', name: 'Tourist Spots' },
  { url: '/bike-rentals-varanasi', name: 'Bike Rentals' },
  { url: '/rates/outstation-taxi-varanasi', name: 'Outstation Rates' },
  { url: '/en/tempo-traveller-varanasi', name: 'Tempo Traveller' },
  { url: '/en/varanasi-travel-agent', name: 'Travel Agent' },
  { url: '/en/dashashwamedh-ghat-ganga-aarti-timing', name: 'Dashashwamedh Aarti' },
  { url: '/en/guide-to-ghats-of-varanasi', name: 'Ghats Guide' },
];

// Old 2025 slugs that should 301 → 2026 equivalents
const REDIRECT_CHECKS = [
  { from: '/en/dev-deepawali-2025-varanasi-ultimate-guide', to: '/en/dev-deepawali-2026-varanasi-ultimate-guide' },
  { from: '/en/varanasi-in-december-2025', to: '/en/varanasi-in-december-2026' },
  { from: '/en/varanasi-in-february-2025', to: '/en/varanasi-in-february-2026' },
  { from: '/en/varanasi-transport-price-guide-2025', to: '/en/varanasi-transport-price-guide-2026' },
  { from: '/en/assi-ghat-aarti-timings-2025', to: '/en/assi-ghat-aarti-timings-2026' },
  { from: '/hi/dev-deepawali-2025-varanasi-ultimate-guide', to: '/hi/dev-deepawali-2026-varanasi-ultimate-guide' },
  { from: '/hi/varanasi-in-december-2025', to: '/hi/varanasi-in-december-2026' },
  { from: '/en/services/varanasi-full-day-city-tour-winter-2025', to: '/en/services/varanasi-full-day-city-tour-winter-2026' },
  // airport-taxi-winter-2025 already has a legacy redirect to /en/varanasi-airport-taxi-price-guide in the config
  { from: '/en/maha-shivaratri-2025-varanasi-guide', to: '/en/maha-shivaratri-2026-varanasi-guide' },
];

// ─── Suite 1: Health Check (all 55 URLs return 200) ────────────────────────────

test.describe('Suite 1: Health Check – all pages return 200', () => {
  for (const page of CRITICAL_PAGES) {
    test(`${page.name} → 200`, async ({ request }) => {
      const res = await request.get(page.url);
      expect(res.status(), `${page.name} (${page.url}) should be 200`).toBe(200);
    });
  }
});

// ─── Suite 2: Content Depth (≥200 words of visible text) ──────────────────────

test.describe('Suite 2: Content Depth – ≥200 words per page', () => {
  for (const pg of CRITICAL_PAGES) {
    test(`${pg.name} has ≥200 words`, async ({ page }) => {
      await page.goto(pg.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const text = await page.locator('body').innerText();
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      expect(wordCount, `${pg.name} has only ${wordCount} words`).toBeGreaterThanOrEqual(200);
    });
  }
});

// ─── Suite 3: No stale "2025" in page text ─────────────────────────────────────

test.describe('Suite 3: No stale "2025" in visible text', () => {
  // Spot-check a subset of 2026-specific pages
  const pagesToCheck = CRITICAL_PAGES.filter(p => p.url.includes('2026'));

  for (const pg of pagesToCheck) {
    test(`${pg.name} should not mention "2025"`, async ({ page }) => {
      await page.goto(pg.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const bodyText = await page.locator('body').innerText();
      const matches = bodyText.match(/\b2025\b/g) || [];
      expect(
        matches.length,
        `${pg.name} still contains ${matches.length} occurrence(s) of "2025"`
      ).toBe(0);
    });
  }
});

// ─── Suite 4: Image Loading ────────────────────────────────────────────────────

test.describe('Suite 4: Image Loading – no broken images', () => {
  for (const pg of IMAGE_CHECK_PAGES) {
    test(`${pg.name} images load`, async ({ page, request }) => {
      await page.goto(pg.url, { waitUntil: 'networkidle', timeout: 45000 });

      const images = await page.locator('img').all();
      const broken: string[] = [];

      for (const img of images) {
        const src = await img.getAttribute('src');
        if (!src || src.startsWith('data:') || src.endsWith('.svg')) continue;

        // Scroll image into view to trigger lazy loading
        await img.scrollIntoViewIfNeeded().catch(() => {});

        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth
        );

        if (naturalWidth === 0) {
          // Image may be lazy-loaded and not yet rendered — verify the
          // underlying URL returns 200 via a direct HEAD request.
          let urlToCheck = src;
          // For Next.js optimized images, extract the original URL
          const match = src.match(/[?&]url=([^&]+)/);
          if (match) urlToCheck = decodeURIComponent(match[1]);
          // Skip placeholder images
          if (urlToCheck.includes('placehold.co')) continue;

          try {
            const res = await request.head(urlToCheck);
            if (res.status() >= 400) {
              broken.push(`${res.status()} ${urlToCheck.substring(0, 120)}`);
            }
          } catch {
            broken.push(`FETCH_ERR ${urlToCheck.substring(0, 120)}`);
          }
        }
      }

      expect(
        broken,
        `Broken images on ${pg.name}:\n${broken.join('\n')}`
      ).toHaveLength(0);
    });
  }
});

// ─── Suite 5: 301 Redirects (old 2025 → new 2026) ─────────────────────────────

test.describe('Suite 5: 301 Redirects – 2025 → 2026', () => {
  for (const r of REDIRECT_CHECKS) {
    test(`${r.from} → ${r.to}`, async ({ request }) => {
      const res = await request.get(r.from, { maxRedirects: 0 });
      expect(res.status(), `Expected 301/308 for ${r.from}`).toBeGreaterThanOrEqual(301);
      expect(res.status()).toBeLessThanOrEqual(308);

      const location = res.headers()['location'] || '';
      // location may be absolute or relative; just check it ends with the target path
      expect(
        location,
        `Redirect destination mismatch for ${r.from}`
      ).toContain(r.to);
    });
  }
});
