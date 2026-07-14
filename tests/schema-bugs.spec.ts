import { test, expect } from '@playwright/test';

/**
 * Schema verification tests — validates JSON-LD output on rendered pages.
 * Runs against localhost to verify the full pipeline (frontmatter + companion JSON + sanitizer).
 */

const BASE = process.env.BASE_URL || 'http://localhost:3111';

// ── Helpers ──────────────────────────────────────────────────

type JsonLdNode = Record<string, unknown>;

const parseSchemas = async (page): Promise<JsonLdNode[]> => {
  return page.$$eval('script[type="application/ld+json"]', (nodes) =>
    nodes.map((node) => {
      try { return JSON.parse(node.textContent || '{}'); }
      catch { return null; }
    }).filter(Boolean)
  );
};

const flattenGraph = (schemas: JsonLdNode[]): JsonLdNode[] => {
  const nodes: JsonLdNode[] = [];
  for (const schema of schemas) {
    if (Array.isArray(schema['@graph'])) {
      (schema['@graph'] as JsonLdNode[]).forEach((n) => nodes.push(n));
    } else {
      nodes.push(schema);
    }
  }
  return nodes;
};

const getTypes = (nodes: JsonLdNode[]): string[] => {
  const types: string[] = [];
  for (const node of nodes) {
    const t = node['@type'];
    if (typeof t === 'string') types.push(t);
    if (Array.isArray(t)) types.push(...(t as string[]));
  }
  return types;
};

// ── Bug 1: No malformed double-domain URLs in rendered JSON-LD ───

test.describe('Bug 1: No malformed double-domain URLs', () => {
  const SAMPLE_PAGES = [
    '/en/12-seater-tempo-traveller-varanasi',
    '/en/best-time-to-visit-varanasi',
    '/en/varanasi-to-prayagraj-taxi',
    '/en/city/varanasi/activities/evening-boat-ride-varanasi-ganga-aarti',
    '/en/varanasi-transport-price-guide-2026',
  ];

  for (const path of SAMPLE_PAGES) {
    test(`${path} has no kashitaxi.inhttps:// URLs`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      const schemas = await parseSchemas(page);
      const raw = JSON.stringify(schemas);
      expect(raw).not.toContain('kashitaxi.inhttps://');
      expect(raw).not.toContain('kashitaxi.inhttp://');
    });
  }
});

// ── Bug 2: OpeningHoursSpecification spelled correctly ───────

test.describe('Bug 2: OpeningHoursSpecification spelled correctly', () => {
  test('vindhyachal page has correct spelling', async ({ page }) => {
    await page.goto(`${BASE}/hi/varanasi-to-vindhyachal-itinerary`, { waitUntil: 'networkidle' });
    const schemas = await parseSchemas(page);
    const raw = JSON.stringify(schemas);
    expect(raw).not.toContain('OpeningHouresSpecification');
    if (raw.includes('OpeningHours')) {
      expect(raw).toContain('OpeningHoursSpecification');
    }
  });
});

// ── Bug 3: No invalid TourOperator @type ─────────────────────

test.describe('Bug 3: No TourOperator @type', () => {
  test('tourist-spots-varanasi uses TravelAgency not TourOperator', async ({ page }) => {
    await page.goto(`${BASE}/en/tourist-spots-varanasi`, { waitUntil: 'networkidle' });
    const schemas = await parseSchemas(page);
    const raw = JSON.stringify(schemas);
    expect(raw).not.toContain('"TourOperator"');
  });
});

// ── Bug 4: No duplicate JSON-LD scripts from inline markdown ─

test.describe('Bug 4: No duplicate schema types on single page', () => {
  const PREVIOUSLY_INLINE = [
    '/en/assi-ghat-aarti-timings-2026',
    '/en/dev-deepawali-2026-varanasi-ultimate-guide',
    '/en/city/varanasi/taxi/airport-taxi-varanasi',
  ];

  for (const path of PREVIOUSLY_INLINE) {
    test(`${path} has no duplicate FAQ/Service schemas`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      const schemas = await parseSchemas(page);
      // Only count top-level @type and direct @graph children (not nested publisher etc.)
      const topTypes: string[] = [];
      for (const schema of schemas) {
        if (schema['@type']) {
          const t = schema['@type'];
          if (typeof t === 'string') topTypes.push(t);
          if (Array.isArray(t)) topTypes.push(...(t as string[]));
        }
        if (Array.isArray(schema['@graph'])) {
          for (const node of schema['@graph'] as JsonLdNode[]) {
            const t = node['@type'];
            if (typeof t === 'string') topTypes.push(t);
            if (Array.isArray(t)) topTypes.push(...(t as string[]));
          }
        }
      }

      const counts: Record<string, number> = {};
      for (const t of topTypes) {
        if (['Question', 'Answer', 'ListItem', 'Offer', 'ContactPoint'].includes(t)) continue;
        counts[t] = (counts[t] || 0) + 1;
      }
      for (const [type, count] of Object.entries(counts)) {
        expect(count, `${path} has ${count}x ${type}`).toBeLessThanOrEqual(1);
      }
    });
  }
});

// ── Bug 5: OG image not malformed ────────────────────────────

test.describe('Bug 5: OG image URLs are valid', () => {
  const DEST_PAGES = [
    '/en/city/varanasi/taxi/airport-taxi-varanasi',
    '/en/city/varanasi/events/chhath-puja-2026-varanasi-guide',
  ];

  for (const path of DEST_PAGES) {
    test(`${path} og:image is a valid URL`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      if (ogImage) {
        expect(ogImage).toMatch(/^https?:\/\//);
        expect(ogImage).not.toContain('kashitaxi.inhttps://');
        // Should not have double protocol
        const protocols = (ogImage.match(/https?:\/\//g) || []).length;
        expect(protocols, `og:image has ${protocols} protocol prefixes`).toBe(1);
      }
    });
  }
});

// ── Bug 6: No duplicate Organization/LocalBusiness per page ──

test.describe('Bug 6: Single Organization schema per page', () => {
  const PAGES_WITH_COMPANION_ORG = [
    '/en/best-time-to-visit-varanasi',
    '/en/12-seater-tempo-traveller-varanasi',
    '/en/about',
  ];

  for (const path of PAGES_WITH_COMPANION_ORG) {
    test(`${path} has exactly 1 Organization schema`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      const schemas = await parseSchemas(page);

      // Count only top-level and direct @graph child Organization nodes.
      // Nested nodes like BlogPosting.publisher are expected and valid.
      let orgCount = 0;
      for (const schema of schemas) {
        const t = schema['@type'];
        const types = Array.isArray(t) ? (t as string[]) : [t as string];
        if (types.some((ty) => ['Organization', 'LocalBusiness', 'TaxiService'].includes(ty))) {
          orgCount++;
        }
        if (Array.isArray(schema['@graph'])) {
          for (const node of schema['@graph'] as JsonLdNode[]) {
            const nt = node['@type'];
            const ntypes = Array.isArray(nt) ? (nt as string[]) : [nt as string];
            if (ntypes.some((ty) => ['Organization', 'LocalBusiness', 'TaxiService'].includes(ty))) {
              orgCount++;
            }
          }
        }
      }
      // Global _app.js injects exactly 1. Per-page companion should NOT add another.
      expect(orgCount, `${path} has ${orgCount} Organization/LocalBusiness nodes`).toBe(1);
    });
  }
});

// ── General: FAQ schema renders correctly from frontmatter ───

test.describe('FAQ schema renders from frontmatter', () => {
  const FAQ_PAGES = [
    { path: '/en/tourist-spots-varanasi', minQuestions: 8 },
    { path: '/en/destinations/varanasi/tour-packages/varanasi-3-day-tour', minQuestions: 8 },
    { path: '/en/destinations/varanasi/tour-packages/ayodhya-varanasi-3-day-tour', minQuestions: 8 },
  ];

  for (const { path, minQuestions } of FAQ_PAGES) {
    test(`${path} has FAQPage with ≥${minQuestions} questions`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      const schemas = await parseSchemas(page);
      const nodes = flattenGraph(schemas);

      const faqNodes = nodes.filter((n) => n['@type'] === 'FAQPage');
      expect(faqNodes.length, 'Should have exactly 1 FAQPage').toBe(1);

      const mainEntity = faqNodes[0].mainEntity;
      expect(Array.isArray(mainEntity)).toBe(true);
      expect((mainEntity as unknown[]).length).toBeGreaterThanOrEqual(minQuestions);
    });
  }
});

// ── General: Breadcrumb schema present on destination pages ──

test.describe('Breadcrumb schema on destination pages', () => {
  const DEST_PAGES = [
    '/en/city/varanasi/taxi/airport-taxi-varanasi',
    '/en/destinations/varanasi/tour-packages/varanasi-3-day-tour',
  ];

  for (const path of DEST_PAGES) {
    test(`${path} has BreadcrumbList`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      const schemas = await parseSchemas(page);
      const nodes = flattenGraph(schemas);
      const hasBreadcrumb = nodes.some((n) => n['@type'] === 'BreadcrumbList');
      expect(hasBreadcrumb, `${path} missing BreadcrumbList`).toBe(true);
    });
  }
});

// ── Event pages: no inline JSON-LD duplication, valid Event + FAQ schemas ──

test.describe('Event pages: inline JSON-LD removed, pipeline schemas valid', () => {
  const EVENT_PAGES = [
    { path: '/en/destinations/varanasi/events/banaras-lit-fest-2026-taxi-booking', hasFaq: false },
    { path: '/en/destinations/varanasi/events/kartik-purnima-ganga-snan-varanasi-2026', hasFaq: true, minQuestions: 5 },
    { path: '/en/destinations/varanasi/events/kashi-tamil-sangamam-2026-varanasi', hasFaq: true, minQuestions: 25 },
    { path: '/en/destinations/varanasi/events/makar-sankranti-ganga-snan-varanasi-2026', hasFaq: true, minQuestions: 5 },
    { path: '/en/destinations/varanasi/events/mauni-amavasya-ganga-snan-varanasi-2026', hasFaq: true, minQuestions: 5 },
  ];

  for (const { path, hasFaq, minQuestions } of EVENT_PAGES) {
    test(`${path} has exactly 1 Event with startDate + location`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      const schemas = await parseSchemas(page);
      const nodes = flattenGraph(schemas);

      const eventNodes = nodes.filter((n) => n['@type'] === 'Event');
      expect(eventNodes.length, 'Should have exactly 1 Event').toBe(1);
      expect(eventNodes[0]).toHaveProperty('startDate');
      expect(eventNodes[0]).toHaveProperty('location');
    });

    if (hasFaq) {
      test(`${path} has FAQPage with ≥${minQuestions} questions`, async ({ page }) => {
        await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
        const schemas = await parseSchemas(page);
        const nodes = flattenGraph(schemas);

        const faqNodes = nodes.filter((n) => n['@type'] === 'FAQPage');
        expect(faqNodes.length, 'Should have exactly 1 FAQPage').toBe(1);

        const mainEntity = faqNodes[0].mainEntity;
        expect(Array.isArray(mainEntity)).toBe(true);
        expect((mainEntity as unknown[]).length).toBeGreaterThanOrEqual(minQuestions!);
      });
    }

    test(`${path} has no duplicate schema types`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      const schemas = await parseSchemas(page);
      const nodes = flattenGraph(schemas);

      // Check no duplicate Event or FAQPage
      const eventCount = nodes.filter((n) => n['@type'] === 'Event').length;
      const faqCount = nodes.filter((n) => n['@type'] === 'FAQPage').length;
      expect(eventCount, 'No duplicate Event').toBeLessThanOrEqual(1);
      expect(faqCount, 'No duplicate FAQPage').toBeLessThanOrEqual(1);
    });
  }
});
