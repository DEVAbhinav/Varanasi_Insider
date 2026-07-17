import { test, expect } from '@playwright/test';

// Regression coverage for the GSC-driven, build-generated RelatedLinks block.
//
// Produced at build time by scripts/generate-link-graph.js and rendered by
// components/seo/RelatedLinks.jsx from data/generated/seo-link-graph.json,
// wired into components/layouts/ContentPageLayout.jsx. Invariants:
//   1. High-traffic informational pages render contextual internal links.
//   2. Informational pages surface a "Book this trip" money funnel.
//   3. ItemList JSON-LD is emitted for the links.
//   4. No self-links and no cross-language (/hi/) links on an EN page.

const SAMPLE = '/en/assi-ghat-aarti-timings-2026';

test.describe('RelatedLinks (generated)', () => {
  test('renders contextual internal links + book funnel', async ({ page }) => {
    await page.goto(SAMPLE);
    const section = page.locator('section[aria-labelledby="related-links-heading"]');
    await expect(section).toBeVisible();
    await expect(page.getByText('Book this trip')).toBeVisible();
    // At least a few contextual links present.
    const links = section.locator('a');
    expect(await links.count()).toBeGreaterThanOrEqual(3);
  });

  test('emits ItemList JSON-LD', async ({ page }) => {
    await page.goto(SAMPLE);
    const blobs = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blobs.some((b) => b.includes('"ItemList"'))).toBeTruthy();
  });

  test('has no self-link and no cross-language links', async ({ page }) => {
    await page.goto(SAMPLE);
    const scope = page.locator('section[aria-labelledby="related-links-heading"]').locator('..');
    // No link back to the same page.
    await expect(scope.locator(`a[href="${SAMPLE}"]`)).toHaveCount(0);
    // No EN->HI leakage in the related block.
    const related = page.locator('section[aria-labelledby="related-links-heading"]');
    await expect(related.locator('a[href^="/hi/"]')).toHaveCount(0);
  });
});
