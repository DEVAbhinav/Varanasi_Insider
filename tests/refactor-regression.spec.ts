import { test, expect, Page } from '@playwright/test';

// Regression coverage for the redundancy refactor:
// 1) destination category route consolidation ([category]/[slug])
// 2) shared markdown loader (bus / packages / static landing pages)
// 3) shared booking-form hook (Hero / Sidebar / standard BookingWidget)
// 4) package WhatsApp link bug fix (message text, not phone number)

const WA_DIGITS = '919935474730';

const DESTINATION_PAGES: Array<{ category: string; path: string; destination: string }> = [
  { category: 'activities', destination: 'varanasi', path: '/en/city/varanasi/activities/84-ghats-boat-tour-varanasi' },
  { category: 'events', destination: 'prayagraj', path: '/en/city/prayagraj/events/magh-mela-2026-travel-guide-varanasi' },
  { category: 'food', destination: 'varanasi', path: '/en/city/varanasi/food/malaiyo-varanasi-guide' },
  { category: 'shopping', destination: 'varanasi', path: '/en/city/varanasi/shopping/banarasi-silk-saree-shopping-varanasi-2026' },
  { category: 'sightseeing', destination: 'varanasi', path: '/en/city/varanasi/sightseeing/dashashwamedh-ghat-boat-ride-ganga-aarti-guide' },
  { category: 'taxi', destination: 'agra', path: '/en/city/agra/taxi/varanasi-to-agra-taxi' },
  { category: 'tour-packages', destination: 'ayodhya', path: '/en/city/ayodhya/tour-packages/ayodhya-2-day-tour' },
  { category: 'travel-guide', destination: 'varanasi', path: '/en/city/varanasi/travel-guide/varanasi-in-january-2026' },
];

async function getJsonLd(page: Page): Promise<any[]> {
  return page.$$eval('script[type="application/ld+json"]', (nodes) =>
    nodes
      .map((n) => {
        try {
          return JSON.parse(n.textContent || '{}');
        } catch {
          return null;
        }
      })
      .filter(Boolean),
  );
}

function collectBreadcrumbUrls(schemas: any[]): string[] {
  const urls: string[] = [];
  const visit = (node: any) => {
    if (!node || typeof node !== 'object') return;
    if (node['@type'] === 'BreadcrumbList' && Array.isArray(node.itemListElement)) {
      node.itemListElement.forEach((el: any) => {
        const item = el?.item;
        if (typeof item === 'string') urls.push(item);
        else if (item && typeof item['@id'] === 'string') urls.push(item['@id']);
      });
    }
    if (Array.isArray(node['@graph'])) node['@graph'].forEach(visit);
  };
  schemas.forEach(visit);
  return urls;
}

// ---------------------------------------------------------------------------
// 1) Destination category route consolidation
// ---------------------------------------------------------------------------
test.describe('Destination category route ([category]/[slug])', () => {
  for (const dp of DESTINATION_PAGES) {
    test(`renders ${dp.category} page with correct category context`, async ({ page }) => {
      const response = await page.goto(dp.path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `HTTP status for ${dp.path}`).toBe(200);

      // Real content: an H1 with text
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      expect((await h1.innerText()).trim().length).toBeGreaterThan(3);

      // Substantial article body rendered (markdown -> HTML worked)
      const bodyText = await page.locator('main, article').first().innerText();
      expect(bodyText.length).toBeGreaterThan(300);

      // The dynamic route passed the right category into schema/breadcrumbs
      const schemas = await getJsonLd(page);
      expect(schemas.length).toBeGreaterThan(0);
      const crumbUrls = collectBreadcrumbUrls(schemas);
      const hasCategorySegment = crumbUrls.some((u) =>
        u.includes(`/city/${dp.destination}/${dp.category}/`),
      );
      expect(
        hasCategorySegment,
        `breadcrumb should reference /city/${dp.destination}/${dp.category}/ — got ${JSON.stringify(crumbUrls)}`,
      ).toBeTruthy();
    });
  }

  test('invalid category returns 404', async ({ page }) => {
    const response = await page.goto('/en/city/varanasi/not-a-real-category/whatever', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
  });

  test('Hindi destination page still resolves', async ({ page }) => {
    const response = await page.goto('/hi/city/agra/taxi/varanasi-to-agra-taxi', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 2) Category index pages coexist with the dynamic [category] route
// ---------------------------------------------------------------------------
test.describe('Category index pages', () => {
  const indexes = [
    '/en/city/varanasi/taxi',
    '/en/city/varanasi/tour-packages',
    '/en/city/ayodhya/tour-packages',
  ];
  for (const path of indexes) {
    test(`index page loads: ${path}`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
      // Directory should link into per-slug pages under the same category
      const category = path.split('/').pop();
      const inCategoryLinks = await page.locator(`a[href*="/${category}/"]`).count();
      expect(inCategoryLinks).toBeGreaterThan(0);
    });
  }
});

// ---------------------------------------------------------------------------
// 3) Shared markdown loader — bus / package / static landing content renders
// ---------------------------------------------------------------------------
test.describe('Markdown loader pages', () => {
  test('bus pilgrimage page renders content + related grid', async ({ page }) => {
    const response = await page.goto('/en/bus/kashi-yatra-south-india-bus-package', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    const bodyText = await page.locator('main').first().innerText();
    expect(bodyText.length).toBeGreaterThan(300);
    await expect(page.getByText('Related Pilgrimage Routes')).toBeVisible();
  });

  for (const path of ['/banaras-tour-package', '/kasi-tour-package', '/banaras-travel-agency']) {
    test(`static landing renders markdown: ${path}`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
      const bodyText = await page.locator('main, article').first().innerText();
      expect(bodyText.length).toBeGreaterThan(500);
    });
  }
});

// ---------------------------------------------------------------------------
// 4) Package page WhatsApp links carry MESSAGE text, not the phone number
// ---------------------------------------------------------------------------
test.describe('Package WhatsApp CTA (waLink fix)', () => {
  test('all WhatsApp CTAs prefill a booking message, not the phone number', async ({ page }) => {
    const response = await page.goto('/en/packages/varanasi-tour-package', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(200);

    const waAnchors = page.locator('a[href*="wa.me"]');
    const count = await waAnchors.count();
    expect(count).toBeGreaterThan(0);

    let prefilledCtas = 0;
    for (let i = 0; i < count; i++) {
      const href = await waAnchors.nth(i).getAttribute('href');
      if (!href || !href.includes('?text=')) continue; // plain contact links are fine
      prefilledCtas += 1;
      const textParam = decodeURIComponent(href.split('?text=')[1].replace(/&amp;/g, '&'));
      // The message must be a real booking sentence...
      expect(textParam.toLowerCase()).toMatch(/book|package/);
      // ...and must NOT be the bare phone number (the old waLink(phone, text) bug).
      expect(textParam.replace(/\D/g, '')).not.toBe('9935474730');
      expect(textParam.replace(/\D/g, '')).not.toBe(WA_DIGITS);
    }
    // At least the primary booking CTA must be a prefilled WhatsApp message.
    expect(prefilledCtas).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 5) Booking forms (shared hook) — Hero 2-step, standard, sidebar
// ---------------------------------------------------------------------------
async function mockContactApi(page: Page) {
  await page.route('**/api/contact-form', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ whatsappLink: `https://wa.me/${WA_DIGITS}?text=confirmed` }),
    });
  });
}

test.describe('Hero booking widget (2-step)', () => {
  test('native guard on step 1, custom phone validation, and successful submit', async ({ page }) => {
    await mockContactApi(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const pickup = page.locator('input[name="pickup"]');
    await expect(pickup).toBeVisible();

    // Step 1 native guard: empty submit is blocked, stays on step 1 (no Trip Summary)
    await page.getByRole('button', { name: /Continue to Contact Details/i }).click();
    await expect(page.getByText(/Trip Summary/i)).toHaveCount(0);
    expect(await pickup.evaluate((el: HTMLInputElement) => el.validity.valid)).toBeFalsy();

    // Fill step 1 and advance
    await pickup.fill('Varanasi Airport');
    await page.locator('input[name="destination"]').fill('Dashashwamedh Ghat');
    await page.locator('input[name="date"]').fill('2027-01-15');
    await page.getByRole('button', { name: /Continue to Contact Details/i }).click();

    // Step 2 visible (trip summary reflects step-1 data)
    await expect(page.getByText(/Trip Summary/i)).toBeVisible();
    await expect(page.getByText('Varanasi Airport → Dashashwamedh Ghat')).toBeVisible();

    // Step 2 custom validation: non-empty but invalid phone
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="phone"]').fill('12345');
    await page.getByRole('button', { name: /Get Instant Quote Now/i }).click();
    await expect(page.getByText(/valid 10-digit/i)).toBeVisible();

    // Valid submit -> success UI
    await page.locator('input[name="phone"]').fill('9935474730');
    await page.getByRole('button', { name: /Get Instant Quote Now/i }).click();
    await expect(page.getByText(/Booking Request Received/i)).toBeVisible();
    const waLink = page.getByRole('link', { name: /Chat on WhatsApp/i });
    await expect(waLink).toBeVisible();
    expect(await waLink.getAttribute('href')).toContain('wa.me');
  });
});

test.describe('Standard booking widget (/booking)', () => {
  test('native guard, custom phone validation, and successful submit', async ({ page }) => {
    await mockContactApi(page);
    await page.goto('/booking', { waitUntil: 'domcontentloaded' });

    const nameInput = page.locator('input[name="name"]').first();
    const phoneInput = page.locator('input[name="phone"]').first();
    await expect(nameInput).toBeVisible();

    // Native guard: empty submit blocked, no success
    await page.getByRole('button', { name: /Get Quote & Book Now/i }).click();
    await expect(page.getByText(/Thank You/i)).toHaveCount(0);
    expect(await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid)).toBeFalsy();

    // Custom validation: non-empty invalid phone
    await nameInput.fill('Test User');
    await phoneInput.fill('00000');
    await page.getByRole('button', { name: /Get Quote & Book Now/i }).click();
    await expect(page.getByText(/valid 10-digit Indian phone number/i)).toBeVisible();

    // Valid submit
    await phoneInput.fill('9935474730');
    await page.getByRole('button', { name: /Get Quote & Book Now/i }).click();
    await expect(page.getByText(/Thank You/i)).toBeVisible();
  });
});

test.describe('Sidebar booking widget (/chatgpt-app/quote-widget)', () => {
  test('native guard, custom phone validation, and successful submit', async ({ page }) => {
    await mockContactApi(page);
    await page.goto('/chatgpt-app/quote-widget', { waitUntil: 'domcontentloaded' });

    const nameInput = page.locator('input[name="name"]').first();
    const phoneInput = page.locator('input[name="phone"]').first();
    await expect(nameInput).toBeVisible();

    // Native guard: empty submit blocked
    await page.getByRole('button', { name: /GET MY FREE QUOTE/i }).click();
    await expect(page.getByText(/Thank You/i)).toHaveCount(0);
    expect(await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid)).toBeFalsy();

    // Custom validation: non-empty invalid phone
    await nameInput.fill('Test User');
    await phoneInput.fill('00000');
    await page.getByRole('button', { name: /GET MY FREE QUOTE/i }).click();
    await expect(page.getByText(/valid 10-digit phone number/i)).toBeVisible();

    // Valid submit
    await phoneInput.fill('9935474730');
    await page.getByRole('button', { name: /GET MY FREE QUOTE/i }).click();
    await expect(page.getByText(/Thank You/i)).toBeVisible();
  });
});

test.describe('Markdown content CTA & media hardening', () => {
  const TAXI_PAGE = '/en/city/varanasi/taxi/24-7-taxi-varanasi';

  test('inline WhatsApp links in content render as button pills (not bare text-links)', async ({ page }) => {
    await page.goto(TAXI_PAGE, { waitUntil: 'domcontentloaded' });

    // The two in-content WhatsApp CTAs are converted to the shared pill button.
    const pills = page.locator('article a.wa-inline-btn[href*="wa.me"], main a.wa-inline-btn[href*="wa.me"]');
    const count = await pills.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const a = pills.nth(i);
      const href = await a.getAttribute('href');
      expect(href).toContain('?text='); // still carries a prefilled message
      // Rendered as a rounded pill button, not a plain link.
      const radius = await a.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
      expect(parseFloat(radius)).toBeGreaterThan(8);
      const display = await a.evaluate((el) => getComputedStyle(el).display);
      expect(display).toContain('inline-block');
    }
  });

  test('no raw markdown WhatsApp link syntax leaks into rendered text', async ({ page }) => {
    await page.goto(TAXI_PAGE, { waitUntil: 'domcontentloaded' });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('](https://wa.me');
  });

  test('image URLs with spaces are encoded and load (200)', async ({ page }) => {
    const response = await page.goto(TAXI_PAGE, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // The tourist-map image must render as an <img> with a space-encoded src...
    const img = page.locator('img[src*="tourist%20map"]').first();
    await expect(img).toHaveCount(1);
    const src = await img.getAttribute('src');
    expect(src).not.toContain(' '); // no raw spaces
    expect(src).toContain('%20');

    // ...and the encoded URL must actually resolve.
    const assetRes = await page.request.get(src!);
    expect(assetRes.status()).toBe(200);

    // The old broken literal markdown must be gone from the page text.
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('tourist map-flat-lanscape.jpeg)');
  });
});
