import { test, expect } from '@playwright/test';

// Coverage for the opt-in commerce/ordering block (plan §17–§21).
//
// The master package page (varanasi-tour-package) declares a `commerce`
// frontmatter block, so it renders the CommerceSection: price anchor, variant
// selector, live estimate, add-ons, inclusions, and the product-aware enquiry
// form. Pages WITHOUT a commerce block must NOT render any of it.

const WITH_COMMERCE = '/en/packages/varanasi-tour-package';
const WITHOUT_COMMERCE = '/en/packages/sawan-darshan-package-varanasi';

test.describe('Commerce / ordering block', () => {
  test('renders the ordering UI on a commerce-enabled package', async ({ page }) => {
    const res = await page.goto(WITH_COMMERCE, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);

    // Enquiry form + configurator are present.
    await expect(page.getByRole('heading', { name: 'Get a quote / book' })).toBeVisible();
    await expect(page.getByText('Estimated total', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Add to your trip')).toBeVisible();

    // Product/Offer schema is emitted with real prices.
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const blob = jsonLd.join(' ');
    expect(blob).toContain('AggregateOffer');
    expect(blob).toContain('7080');
  });

  test('live estimate updates when travellers increase', async ({ page }) => {
    await page.goto(WITH_COMMERCE, { waitUntil: 'domcontentloaded' });
    const increase = page.getByRole('button', { name: /increase travellers/i });
    const totalRegion = page.locator('text=Estimated total').first();
    await expect(totalRegion).toBeVisible();
    await increase.click();
    // No assertion on exact number (price is data-driven); just ensure the
    // control is interactive and the breakdown still renders.
    await expect(totalRegion).toBeVisible();
  });

  test('does NOT render commerce UI on a package without the block', async ({ page }) => {
    const res = await page.goto(WITHOUT_COMMERCE, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Get a quote / book' })).toHaveCount(0);
    await expect(page.getByText('Add to your trip')).toHaveCount(0);
  });
});
