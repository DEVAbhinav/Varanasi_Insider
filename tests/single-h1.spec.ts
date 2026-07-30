import { test, expect } from '@playwright/test';

// Regression coverage for the "exactly one <h1> per page" SEO fix.
//
// Templates that render their own hero/header <h1> (destination, service,
// package, category directory, static landing pages) previously ALSO emitted
// the markdown body's leading `# ` as a second <h1>. The body H1 is now demoted
// to <h2> in each of those render paths. Plain content pages (ContentPageLayout,
// no hero) keep the markdown H1 as their single page H1.
//
// One representative URL per template + the specific pages that were previously
// broken (missing H1 / multiple H1 authoring cases).
const PAGES: Array<{ label: string; path: string }> = [
  // Templates with a hero <h1> + markdown body (body H1 demoted to H2)
  { label: 'destination (taxi route)', path: '/en/city/varanasi/taxi/taxi-service-varanasi' },
  { label: 'destination (outstation)', path: '/en/city/agra/taxi/varanasi-to-agra-taxi' },
  { label: 'category directory', path: '/en/city/varanasi/taxi/varanasi-airport-transfer-directory' },
  { label: 'service page', path: '/en/services/varanasi-safest-taxi-for-women' },
  { label: 'package page', path: '/en/packages/varanasi-tour-package' },
  { label: 'static landing (kasi tour)', path: '/kasi-tour-package' },
  { label: 'static landing (banaras agency)', path: '/banaras-travel-agency' },
  { label: 'static landing (bike rentals)', path: '/bike-rentals-varanasi' },
  { label: 'homepage', path: '/' },

  // Plain content pages (markdown H1 is the only H1) — previously broken
  { label: 'previously missing H1 (where to stay)', path: '/en/where-to-stay-in-varanasi' },
  { label: 'previously missing H1 (homestay)', path: '/en/varanasi-family-homestay-4bhk-sigra' },
  { label: 'previously double H1 (outstation cabs)', path: '/en/outstation-cabs-from-varanasi' },
  { label: 'previously double H1 (dussehra)', path: '/en/dussehra-ravana-dahan-varanasi' },
];

test.describe('Exactly one <h1> per page', () => {
  for (const p of PAGES) {
    test(`${p.label} (${p.path}) has exactly one H1`, async ({ page }) => {
      const response = await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `HTTP status for ${p.path}`).toBe(200);

      const count = await page.locator('h1').count();
      expect(count, `H1 count on ${p.path}`).toBe(1);

      const h1Text = (await page.locator('h1').first().innerText()).trim();
      expect(h1Text.length, `H1 text length on ${p.path}`).toBeGreaterThan(3);
    });
  }
});
