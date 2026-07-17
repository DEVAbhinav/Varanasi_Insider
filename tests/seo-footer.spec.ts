import { test, expect } from '@playwright/test';

// Regression coverage for the GSC-driven, build-generated SEO footer.
//
// The footer is produced at build time by scripts/generate-link-graph.js and
// rendered by components/Footer/Footer.jsx from data/generated/seo-link-graph.json.
// These checks lock in the SEO-critical invariants:
//   1. Categorized commercial link groups render (not the old "All Posts" dump).
//   2. The #1 money page (bike/scooty rental) is present and pinned.
//   3. The old sitewide 9-link external backlink block is gone (at most ONE
//      external parent-company link remains).
//   4. No cross-language links (an EN page footer never links to /hi/*).
//   5. SiteNavigationElement JSON-LD is emitted.

test.describe('SEO footer (generated)', () => {
  test('renders categorized commercial groups incl. the top money page', async ({ page }) => {
    await page.goto('/bike-rentals-varanasi');
    const footer = page.locator('footer');
    await expect(footer).toContainText('Bike & Scooty Rental');
    await expect(footer).toContainText('Taxi Services in Varanasi');
    await expect(footer).toContainText('Varanasi Tour Packages');
    // The old post dump must be gone.
    await expect(footer).not.toContainText('All Posts');
    // The proven #1 sales page is linked.
    await expect(footer.locator('a[href="/bike-rentals-varanasi"]')).toHaveCount(1);
  });

  test('has at most one external link and it is the parent company', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    // The retired external block pointed multiple links at bharat-tourism.com.
    const external = footer.locator('a[href*="bharat-tourism.com"]');
    await expect(external).toHaveCount(1);
    await expect(external).toContainText(/Bharat Tourism/i);
  });

  test('EN page footer contains no cross-language (/hi/) links', async ({ page }) => {
    await page.goto('/');
    const hiLinks = page.locator('footer a[href^="/hi/"]');
    await expect(hiLinks).toHaveCount(0);
  });

  test('emits SiteNavigationElement structured data', async ({ page }) => {
    await page.goto('/bike-rentals-varanasi');
    const found = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .some((s) => (s.textContent || '').includes('SiteNavigationElement'))
    );
    expect(found).toBe(true);
  });
});
